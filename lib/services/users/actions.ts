"use server"

import { createUser } from "@/lib/services/users/post";
import { createAssembly } from "@/lib/services/assemblies/post";
import { getUsers, getCurrentUser as getCurrentUserFromDB } from "@/lib/services/users/get";
import { getAssemblies } from "@/lib/services/assemblies/get";
import { authorizeUser } from "@/lib/services/users/post";

export async function checkSystemStatus() {
  try {
    // Check if admin users exist
    const usersResult = await getUsers({ role: "admin" });
    const hasAdmins = usersResult.success && usersResult.users && usersResult.users.length > 0;

    // Check if assemblies exist
    const assembliesResult = await getAssemblies();
    const hasAssemblies = assembliesResult.success && assembliesResult.data?.assemblies && assembliesResult.data.assemblies.length > 0;

    return {
      hasAdmins,
      hasAssemblies,
      canRegister: !hasAdmins && !hasAssemblies
    };
  } catch (error) {
    console.error("Error checking system status:", error);
    // In case of error, allow registration
    return {
      hasAdmins: false,
      hasAssemblies: false,
      canRegister: true
    };
  }
}

export async function registerSystem(data: {
  // User details
  name: string;
  phone_number: string;
  email: string;
  password: string;
  // Assembly details
  assembly_code: string;
  assembly_name: string;
  district?: string;
  region?: string;
  population?: number;
  area_sq_km?: number;
  address?: string;
  phone?: string;
  email_assembly?: string;
  collection_target?: string;
}) {
  try {
    // Create assembly first
    const assemblyResult = await createAssembly({
      code: data.assembly_code,
      name: data.assembly_name,
      district: data.district,
      region: data.region,
      population: data.population,
      area_sq_km: data.area_sq_km,
      address: data.address,
      phone: data.phone,
      email: data.email_assembly,
      collection_target: data.collection_target,
    });

    if (!assemblyResult.success) {
      throw new Error(assemblyResult.error || "Failed to create assembly");
    }

    // Create user as admin
    const userResult = await createUser({
      name: data.name,
      phone_number: data.phone_number,
      email: data.email,
      password: data.password,
      role: "admin",
      assembly_ward: data.assembly_name, // Link user to the assembly
    });

    if (!userResult.success) {
      throw new Error(userResult.error || "Failed to create admin user");
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const result = await authorizeUser(data);

    if (!result.success) {
      throw new Error(result.error || "Login failed");
    }

    return {
      success: true,
      user: result.data?.user
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed"
    };
  }
}

export async function getCurrentUser() {
  try {
    const result = await getCurrentUserFromDB();

    if (!result.success) {
      throw new Error(result.error || "Failed to get current user");
    }

    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get current user"
    };
  }
}
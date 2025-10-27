"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser } from "@/lib/services/users/post";
import { createAssembly } from "@/lib/services/assemblies/post";
import { getUsers } from "@/lib/services/users/get";
import { getAssemblies } from "@/lib/services/assemblies/get";

// Form validation schema
const registrationSchema = z.object({
  // User details
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  // Assembly details
  assembly_code: z.string().min(2, "Assembly code must be at least 2 characters"),
  assembly_name: z.string().min(2, "Assembly name must be at least 2 characters"),
  district: z.string().optional(),
  region: z.string().optional(),
  population: z.number().int().min(0).optional(),
  area_sq_km: z.number().int().min(0).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email_assembly: z.string().email("Invalid email address").optional(),
  collection_target: z.string().optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
      password: "",
      assembly_code: "",
      assembly_name: "",
      district: "",
      region: "",
      population: undefined,
      area_sq_km: undefined,
      address: "",
      phone: "",
      email_assembly: "",
      collection_target: "",
    },
  });

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Check if admin users exist
      const usersResult = await getUsers({ role: "admin" });
      const hasAdmins = usersResult.success && usersResult.users && usersResult.users.length > 0;

      // Check if assemblies exist
      const assembliesResult = await getAssemblies();
      const hasAssemblies = assembliesResult.success && assembliesResult.data?.assemblies && assembliesResult.data.assemblies.length > 0;

      // Show registration form only if no admins and no assemblies exist
      setShowForm(!hasAdmins && !hasAssemblies);

      // If system is already initialized, redirect to dashboard
      if (hasAdmins || hasAssemblies) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error checking system status:", error);
      // In case of error, show form to allow initialization
      setShowForm(true);
    } finally {
      setIsChecking(false);
    }
  };

  const onSubmit = async (data: RegistrationForm) => {
    setIsLoading(true);
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

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      // In a real app, you'd show a toast notification here
      alert("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking system status...</p>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>System Already Initialized</CardTitle>
            <CardDescription>
              The system has already been set up with administrators and assemblies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Initialize Revenue System</CardTitle>
          <CardDescription>
            Create the first administrator account and assembly for your revenue collection system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Administrator Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Administrator Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+233-123-456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Minimum 8 characters" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Assembly Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Assembly Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assembly_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assembly Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ASM001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assembly_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assembly Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Central Assembly" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input placeholder="Accra Metropolitan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="greater_accra">Greater Accra</SelectItem>
                            <SelectItem value="ashanti">Ashanti</SelectItem>
                            <SelectItem value="central">Central</SelectItem>
                            <SelectItem value="western">Western</SelectItem>
                            <SelectItem value="eastern">Eastern</SelectItem>
                            <SelectItem value="volta">Volta</SelectItem>
                            <SelectItem value="northern">Northern</SelectItem>
                            <SelectItem value="upper_east">Upper East</SelectItem>
                            <SelectItem value="upper_west">Upper West</SelectItem>
                            <SelectItem value="oti">Oti</SelectItem>
                            <SelectItem value="north_east">North East</SelectItem>
                            <SelectItem value="savannah">Savannah</SelectItem>
                            <SelectItem value="bono">Bono</SelectItem>
                            <SelectItem value="bono_east">Bono East</SelectItem>
                            <SelectItem value="ahafo">Ahafo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="population"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Population</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50000"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area_sq_km"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (sq km)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="25"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assembly Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+233-123-456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email_assembly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assembly Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="assembly@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Physical address of the assembly" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collection_target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Target</FormLabel>
                      <FormControl>
                        <Input placeholder="GHS 500,000/month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Initializing System..." : "Initialize Revenue System"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
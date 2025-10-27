"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { checkSystemStatus, registerSystem } from "@/lib/services/users/actions";
import { RegisterLayout } from "@/components/features/users/register-layout";
import { RegisterUser, type AdminDetailsForm } from "@/components/features/users/register-user";
import { RegisterAssembly, type AssemblyDetailsForm } from "@/components/features/users/register-assembly";

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

// Create separate schemas for each step
const adminDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const assemblyDetailsSchema = z.object({
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

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Separate forms for each step
  const adminForm = useForm<AdminDetailsForm>({
    resolver: zodResolver(adminDetailsSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
      password: "",
    },
  });

  const assemblyForm = useForm<AssemblyDetailsForm>({
    resolver: zodResolver(assemblyDetailsSchema),
    defaultValues: {
      assembly_code: "",
      assembly_name: "",
      district: "",
      region: "",
      population: 0,
      area_sq_km: 0,
      address: "",
      phone: "",
      email_assembly: "",
      collection_target: "",
    },
  });

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await checkSystemStatus();

      // Show registration form only if no admins and no assemblies exist
      setShowForm(status.canRegister);

      // If system is already initialized, redirect to home page
      if (!status.canRegister) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error checking system status:", error);
      // In case of error, show form to allow initialization
      setShowForm(true);
    } finally {
      setIsChecking(false);
    }
  };

  const nextStep = () => setCurrentStep(2);
  const prevStep = () => setCurrentStep(1);

  const onAdminSubmit = async (data: AdminDetailsForm) => {
    // Validate admin form and move to next step
    const isValid = await adminForm.trigger();
    if (isValid) {
      nextStep();
    }
  };

  const onAssemblySubmit = async (data: AssemblyDetailsForm) => {
    setIsLoading(true);
    try {
      const adminData = adminForm.getValues();
      const assemblyData = assemblyForm.getValues();

      // Prepend +233 to phone numbers
      const formattedAdminData = {
        ...adminData,
        phone_number: `233${adminData.phone_number.replace(/^\+?233/, '')}`
      };

      const formattedAssemblyData = {
        ...assemblyData,
        phone: assemblyData.phone ? `233${assemblyData.phone.replace(/^\+?233/, '')}` : undefined
      };

      const result = await registerSystem({
        ...formattedAdminData,
        ...formattedAssemblyData,
      });

      if (!result.success) {
        throw new Error(result.error || "Registration failed");
      }

      // Redirect to home page on success
      router.push("/");
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
      <RegisterLayout>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking system status...</p>
        </div>
      </RegisterLayout>
    );
  }

  if (!showForm) {
    return (
      <RegisterLayout>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">System Already Initialized</h2>
          <p className="text-gray-600">
            The system has already been set up with administrators and assemblies.
          </p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go to Home
          </Button>
        </div>
      </RegisterLayout>
    );
  }

  return (
    <RegisterLayout>
      <div className="space-y-6">
        {/* Stepper */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Initialize Revenue System</h2>
          <p className="text-gray-600">
            Create the first administrator account and assembly for your revenue collection system
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className={`text-sm font-medium ${
              currentStep >= 1 ? 'text-gray-900' : 'text-gray-600'
            }`}>Administrator Details</span>
          </div>
          <div className={`w-8 h-px ${currentStep > 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`text-sm font-medium ${
              currentStep >= 2 ? 'text-gray-900' : 'text-gray-600'
            }`}>Assembly Details</span>
          </div>
        </div>

      

        {currentStep === 1 && (
          <RegisterUser adminForm={adminForm} onSubmit={onAdminSubmit} />
        )}

        {currentStep === 2 && (
          <RegisterAssembly
            assemblyForm={assemblyForm}
            onSubmit={onAssemblySubmit}
            onBack={prevStep}
            isLoading={isLoading}
          />
        )}
      </div>
    </RegisterLayout>
  );
}
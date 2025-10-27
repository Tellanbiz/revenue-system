"use client"

import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface AssemblyDetailsForm {
  assembly_code: string
  assembly_name: string
  district?: string
  region?: string
  population?: number
  area_sq_km?: number
  address?: string
  phone?: string
  email_assembly?: string
  collection_target?: string
}

interface RegisterAssemblyProps {
  assemblyForm: UseFormReturn<AssemblyDetailsForm>
  onSubmit: (data: AssemblyDetailsForm) => void
  onBack: () => void
  isLoading: boolean
}

export function RegisterAssembly({ assemblyForm, onSubmit, onBack, isLoading }: RegisterAssemblyProps) {
  return (
    <Form {...assemblyForm}>
      <form onSubmit={assemblyForm.handleSubmit(onSubmit)} className="space-y-6">
        {/* Assembly Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Assembly Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={assemblyForm.control}
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
              control={assemblyForm.control}
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
              control={assemblyForm.control}
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
              control={assemblyForm.control}
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
              control={assemblyForm.control}
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
              control={assemblyForm.control}
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
              control={assemblyForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assembly Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                        +233
                      </span>
                      <Input
                        placeholder="123-456789"
                        className="pl-16"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={assemblyForm.control}
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
            control={assemblyForm.control}
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
            control={assemblyForm.control}
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

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Initializing System..." : "Complete Registration"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
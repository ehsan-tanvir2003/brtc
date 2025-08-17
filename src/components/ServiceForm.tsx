"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { serviceOptions, type ServiceName, operatorOptions, timeDurationOptions } from "@/types";
import { ServiceIcon } from "@/components/ServiceIcon";
import { Terminal } from "lucide-react";

const formSchema = z.object({
  service: z.enum(serviceOptions, {
    required_error: "Please select a service.",
  }),
  inputValue: z.string().min(1, { message: "This field is required." }),
  operator: z.enum(operatorOptions).optional(),
  timeDuration: z.enum(timeDurationOptions).optional(),
  paymentTotal: z.string().min(1, { message: "Payment amount is required."}),
  deliveryTime: z.string().min(1, { message: "Delivery time is required." }),
});

type FormValues = z.infer<typeof formSchema>;

const servicePlaceholders: Record<ServiceName, string> = {
  "NID to All Number": "Enter NID number...",
  "Mobile Number to NID": "Enter mobile number...",
  "CDR (Call Logs)": "Enter MSISDN...",
  "Location Tracking": "Enter MSISDN or Target ID...",
  "IMEI to All Numbers": "Enter IMEI number...",
  "Nagad Info": "Enter Nagad account number...",
  "Nagad Statement": "Enter Nagad account number...",
  "Bkash Info": "Enter Bkash account number...",
  "Bkash Statement": "Enter Bkash account number...",
};

interface ServiceFormProps {
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
}

export function ServiceForm({ onSubmit, isLoading }: ServiceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: serviceOptions[0],
      inputValue: "",
      paymentTotal: "",
      deliveryTime: "",
    },
  });

  const selectedService = form.watch("service");

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select a service to begin..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {serviceOptions.map((service) => (
                    <SelectItem key={service} value={service}>
                      <div className="flex items-center gap-2">
                        <ServiceIcon service={service} className="h-4 w-4 text-accent" />
                        <span>{service}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inputValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Input Data</FormLabel>
              <FormControl>
                <Input
                  className="bg-input"
                  placeholder={servicePlaceholders[selectedService]}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedService === "CDR (Call Logs)" && (
          <>
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operator</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select an operator..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {operatorOptions.map((operator) => (
                        <SelectItem key={operator} value={operator}>
                          {operator}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select time duration..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeDurationOptions.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="paymentTotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Total</FormLabel>
              <FormControl>
                <Input
                  className="bg-input"
                  placeholder="Enter amount paid by customer..."
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time to Delivery</FormLabel>
              <FormControl>
                <Input
                  className="bg-input"
                  placeholder="e.g., 12-24 hours"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Executing..." : (
            <>
              <Terminal className="mr-2 h-4 w-4" />
              Generate Voucher
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

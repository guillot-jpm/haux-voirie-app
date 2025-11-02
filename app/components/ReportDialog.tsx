"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISSUE_TYPES, SEVERITY_LEVELS, LABELS } from "@/app/lib/constants";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  issueType: z.enum(ISSUE_TYPES),
  severity: z.enum(SEVERITY_LEVELS),
});

interface ReportDialogProps {
  location: { lat: number; lng: number };
  onClose: () => void;
  onReportSubmitted: () => void;
}

export default function ReportDialog({
  location,
  onClose,
  onReportSubmitted,
}: ReportDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          latitude: location.lat,
          longitude: location.lng,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit report");
      }

      onReportSubmitted(); // Notify parent component of success
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report a New Issue</DialogTitle>
          <DialogDescription>
            Submit a report for the selected location:{" "}
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Issue</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an issue type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ISSUE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {LABELS[type]}
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
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a severity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SEVERITY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {LABELS[level]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Submitting..."
                : "Submit Report"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

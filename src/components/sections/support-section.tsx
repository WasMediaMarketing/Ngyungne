"use client";

import { Label } from "@/components/ui/label";

import type React from "react";

import { motion, useInView } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, BookOpen, Users, Upload, X } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createDonation } from "@/utils/donationApi";
import Spinner from "../spinner";

const supportOptions = [
  {
    title: "Monthly Donation",
    description:
      "Support our ongoing programs and maintenance with a monthly contribution.",
    icon: Heart,
    options: ["$10/month", "$25/month", "$50/month", "$100/month"],
    benefits: [
      "Support daily operations",
      "Help maintain facilities",
      "Fund teaching programs",
      "Monthly merit dedication",
    ],
    donationType: "monthly",
  },
  {
    title: "One-time Donation",
    description:
      "Make a one-time contribution to support our mission and activities.",
    icon: Gift,
    options: ["$50", "$100", "$250", "$500"],
    benefits: [
      "Support special projects",
      "Fund retreat scholarships",
      "Help with maintenance",
      "Merit dedication",
    ],
    donationType: "one-time",
  },
  {
    title: "Sponsor a Program",
    description: "Help make Buddhist teachings accessible to more people.",
    icon: BookOpen,
    options: ["$500", "$1000", "$2500", "$5000"],
    benefits: [
      "Fund teaching programs",
      "Support student scholarships",
      "Enable live streaming",
      "Special dedication ceremony",
    ],
    donationType: "program",
  },
];

const paymentMethods = [
  { id: "bank", name: "Bank Transfer" },
  { id: "khalti", name: "Khalti" },
  { id: "esewa", name: "eSewa" },
];

export function SupportSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLLabelElement>(null);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      amount: "",
      paymentMethod: "bank",
      receiveUpdates: true,
    },
  });

  const handleSupportNow = (option: any) => {
    setSelectedOption(option);
    setIsDialogOpen(true);
    // Reset form when opening dialog
    form.reset({
      fullName: "",
      email: "",
      phone: "",
      amount: donationAmount.replace(/[^0-9]/g, "") || "",
      paymentMethod: "bank",
      receiveUpdates: true,
    });
  };

  const handleAmountSelect = (amount: string) => {
    setDonationAmount(amount);
    form.setValue("amount", amount.replace(/[^0-9]/g, ""));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      // Check if file is an image
      if (!file.type.match("image.*")) {
        toast.error("Error", {
          description: "Please upload an image file",
        });
        return;
      }

      setScreenshot(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);

      // Update the file input
      if (fileInputRef.current) {
        // Create a DataTransfer object to set the files property
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  }, []);

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: any) => {
    if (!screenshot) {
      toast.error("Error", {
        description: "Please upload a payment screenshot",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const donationData = {
        name: data.fullName,
        email: data.email,
        phoneNumber: data.phone,
        amount: Number.parseFloat(data.amount),
        donationType: selectedOption?.donationType || "one-time",
        donationMethod: data.paymentMethod,
        page: "support-section",
        pageTitle: selectedOption?.title || "Support Section",
      };

      await createDonation(donationData, screenshot);

      // Close dialog and reset form after successful submission
      setIsDialogOpen(false);
      form.reset();
      setScreenshot(null);
      setScreenshotPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Thank you for your support!", {
        description: "Your donation has been received successfully.",
      });
    } catch (error) {
      console.error("Donation submission error:", error);
      toast.error("Submission failed", {
        description:
          "There was an error processing your donation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Support Our Mission
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Help Us Spread Buddhist Teachings
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your generous support helps us maintain our facilities, support
              our teachers, and make Buddhist teachings accessible to all.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{option.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">
                      {option.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {option.options.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            handleAmountSelect(amount);
                            handleSupportNow(option);
                          }}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2 mb-6">
                      {option.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleSupportNow(option)}
                    >
                      Support Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-2">
              Support {selectedOption?.title || "Our Mission"}
            </DialogTitle>
            <DialogDescription className="text-center">
              Your support helps us continue our important work. Thank you for
              your generosity.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        Donation Amount *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            placeholder="Enter donation amount"
                            className="pl-8"
                            type="number"
                            min="1"
                            required
                            {...field}
                            value={
                              donationAmount.replace(/[^0-9]/g, "") ||
                              field.value
                            }
                            onChange={(e) => {
                              setDonationAmount(e.target.value);
                              field.onChange(e);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-lg font-medium">
                        Payment Method *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2"
                        >
                          <div className="border rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-2 p-3 border-b">
                              <RadioGroupItem value="bank" id="bank" />
                              <label
                                htmlFor="bank"
                                className="flex-1 cursor-pointer font-medium"
                              >
                                Bank Transfer
                              </label>
                            </div>
                            {field.value === "bank" && (
                              <div className="p-3 bg-gray-50">
                                <p>
                                  <strong>Beneficiary Name:</strong> B.T.M.C.
                                  Foundation
                                </p>
                                <p>
                                  <strong>Bank Name:</strong> NMB Bank
                                </p>
                                <p>
                                  <strong>SWIFT:</strong> NMBBNPKA
                                </p>
                                <p>
                                  <strong>A/C No.:</strong> 2222410016305780
                                </p>
                                <p>
                                  <strong>Branch:</strong> Boudha Branch,
                                  Kathmandu, Nepal
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-2 p-3 border-b">
                              <RadioGroupItem value="khalti" id="khalti" />
                              <label
                                htmlFor="khalti"
                                className="flex-1 cursor-pointer font-medium"
                              >
                                Khalti
                              </label>
                            </div>
                            {field.value === "khalti" && (
                              <div className="p-3 bg-gray-50">
                                <p className="text-sm mb-2">Khalti Payment:</p>

                                <p className="text-sm mt-2 text-gray-600">
                                  Khalti ID: 9849118562
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-2 p-3 border-b">
                              <RadioGroupItem value="esewa" id="esewa" />
                              <label
                                htmlFor="esewa"
                                className="flex-1 cursor-pointer font-medium"
                              >
                                eSewa
                              </label>
                            </div>
                            {field.value === "esewa" && (
                              <div className="p-3 bg-gray-50">
                                <p className="text-sm mb-2">eSewa Payment:</p>

                                <p className="text-sm mt-2 text-gray-600">
                                  eSewa ID: 9849118562
                                </p>
                              </div>
                            )}
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel className="text-lg font-medium">
                    Payment Screenshot *
                  </FormLabel>
                  <div className="mt-1">
                    <Label
                      htmlFor="support-screenshot-upload"
                      ref={dropZoneRef}
                      className={`cursor-pointer flex flex-col items-center justify-center w-full border-2 ${
                        isDragging
                          ? "border-primary"
                          : "border-dashed border-gray-300"
                      } rounded-md p-4 hover:bg-gray-50 transition-colors`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        id="support-screenshot-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        required
                      />

                      {!screenshotPreview ? (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                          <p className="text-sm text-gray-700">
                            {screenshot
                              ? screenshot.name
                              : "Upload payment screenshot"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Click to browse or drag and drop
                          </p>
                        </div>
                      ) : (
                        <div className="relative w-full">
                          <div className="absolute top-2 right-2 z-10">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeScreenshot();
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="relative w-full aspect-video">
                            <img
                              src={screenshotPreview || "/placeholder.svg"}
                              alt="Payment screenshot"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs text-center text-gray-500 mt-2">
                            Click to change image
                          </p>
                        </div>
                      )}
                    </Label>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="receiveUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Receive Updates</FormLabel>
                        <FormDescription>
                          Receive occasional updates about our work and how your
                          support is helping
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setScreenshot(null);
                    setScreenshotPreview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner text="Submitting..." />
                  ) : (
                    "Complete Support"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

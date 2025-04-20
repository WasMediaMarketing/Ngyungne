"use client";

import { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import type { CauseUI } from "@/utils/causeApi";
import { RefreshCw, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { createDonation } from "@/utils/donationApi";

interface DonationSheetProps {
  cause: CauseUI;
  isOpen: boolean;
  onClose: () => void;
}

export function DonationSheet({ cause, isOpen, onClose }: DonationSheetProps) {
  // Form state
  const [donationAmount, setDonationAmount] = useState<string>("50");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [receiveUpdates, setReceiveUpdates] = useState<boolean>(true);

  // Screenshot upload state
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove screenshot
  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const finalAmount = customAmount
      ? parseFloat(customAmount)
      : parseFloat(donationAmount);

    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast.error("Error", {
        description: "Please enter a valid donation amount",
      });
      return;
    }

    if (!fullName) {
      toast.error("Error", {
        description: "Please enter your full name",
      });
      return;
    }

    if (!email) {
      toast.error("Error", {
        description: "Please enter your email address",
      });
      return;
    }

    if (!phone) {
      toast.error("Error", {
        description: "Please enter your phone number",
      });
      return;
    }

    if (!screenshot) {
      toast.error("Error", {
        description: "Please upload a payment screenshot",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare donation data
      const donationData = {
        name: fullName,
        email: email,
        phoneNumber: phone,
        amount: finalAmount,
        donationType: "Cause",
        donationTypeId: cause.id,
        donationMethod: paymentMethod,
        page: "cause-detail", // Dynamic page name
        pageTitle: cause.title, // Dynamic page title from cause
      };

      // Submit donation
      const result = await createDonation(donationData, screenshot);

      if (result) {
        toast.success("Success", {
          description:
            "Your donation has been submitted successfully. Thank you for your support!",
        });

        setIsSuccess(true);

        // Reset form after success
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          // Reset form fields
          setDonationAmount("50");
          setCustomAmount("");
          setFullName("");
          setEmail("");
          setPhone("");
          setPaymentMethod("bank");
          setScreenshot(null);
          setScreenshotPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error("Error", {
        description:
          "There was a problem submitting your donation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl text-crimson-800">
            Support {cause.title}
          </SheetTitle>
          <SheetDescription>
            Your donation helps us continue our important work. Thank you for
            your generosity.
          </SheetDescription>
        </SheetHeader>

        {isSuccess ? (
          <div className="mt-8 text-center">
            <div className="bg-green-50 text-green-800 p-6 rounded-lg mb-4">
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p>Your donation has been processed successfully.</p>
            </div>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-4">
              {/* Select Donation Amount */}
              <div className="space-y-2">
                <label className="text-lg font-medium">
                  Select Donation Amount
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {["25", "50", "100", "250"].map((amount) => (
                    <button
                      type="button"
                      key={amount}
                      className={`text-lg py-6 px-4 rounded-md ${
                        donationAmount === amount
                          ? "bg-crimson-600 text-white"
                          : "border border-gray-300"
                      }`}
                      onClick={() => {
                        setDonationAmount(amount);
                        setCustomAmount(amount); // Show selected amount in the input field
                      }}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <label className="text-lg font-medium">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    placeholder="Enter custom amount"
                    className="pl-8 border border-gray-300 rounded-md py-2 px-3 w-full"
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setDonationAmount(e.target.value); // Update donationAmount with typed input
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter your full name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Enter your phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium">Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
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
                    {paymentMethod === "bank" && (
                      <div className="p-3 bg-gray-50">
                        <p className="text-sm mb-2">Bank Account Details:</p>
                        <p className="text-sm">Bank Name: Example Bank</p>
                        <p className="text-sm">
                          Account Name: Charity Foundation
                        </p>
                        <p className="text-sm">Account Number: 1234567890</p>
                        <p className="text-sm mt-2 text-gray-600">
                          Please include your name as reference
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
                    {paymentMethod === "khalti" && (
                      <div className="p-3 bg-gray-50">
                        <p className="text-sm mb-2">Khalti Payment:</p>
                        <p className="text-sm">
                          You will be redirected to Khalti to complete your
                          payment.
                        </p>
                        <p className="text-sm mt-2 text-gray-600">
                          Khalti ID: charity@example.com
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
                    {paymentMethod === "esewa" && (
                      <div className="p-3 bg-gray-50">
                        <p className="text-sm mb-2">eSewa Payment:</p>
                        <p className="text-sm">
                          You will be redirected to eSewa to complete your
                          payment.
                        </p>
                        <p className="text-sm mt-2 text-gray-600">
                          eSewa ID: 9876543210
                        </p>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Screenshot Upload */}
              <div className="space-y-2">
                <Label htmlFor="screenshot" className="text-maroon-700">
                  Payment Screenshot *
                </Label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-md transition-colors ${
                    isDragging
                      ? "border-crimson-500 bg-saffron-100"
                      : screenshotPreview
                      ? "border-saffron-300"
                      : "border-saffron-300 hover:bg-saffron-100"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    id="screenshot-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    required
                  />

                  {screenshotPreview ? (
                    <div className="relative p-2">
                      <div className="relative aspect-video w-full overflow-hidden rounded-md">
                        <Image
                          src={screenshotPreview || "/placeholder.svg"}
                          alt="Payment screenshot preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4 h-8 w-8 rounded-full"
                        onClick={removeScreenshot}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-sm text-center mt-2 text-maroon-700">
                        {screenshot?.name}
                      </p>
                    </div>
                  ) : (
                    <Label
                      htmlFor="screenshot-upload"
                      className="cursor-pointer flex items-center justify-center w-full p-4 hover:bg-saffron-100 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-maroon-500 mb-2" />
                        <p className="text-sm text-maroon-700">
                          Upload payment screenshot
                        </p>
                        <p className="text-xs text-maroon-500 mt-1">
                          Click to browse or drag and drop
                        </p>
                      </div>
                    </Label>
                  )}
                </div>
              </div>

              <div className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                <Checkbox
                  checked={receiveUpdates}
                  onCheckedChange={(checked) =>
                    setReceiveUpdates(checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label>Receive Updates</Label>
                  <p className="text-sm text-gray-500">
                    Receive occasional updates about our work and how your
                    donation is helping
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-crimson-600 hover:bg-crimson-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Donation"
                )}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

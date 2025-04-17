"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import {
  Heart,
  CreditCard,
  Banknote,
  Upload,
  X,
  ImageIcon,
} from "lucide-react";
import { SupportSection } from "@/components/sections/support-section";
import { createDonation } from "@/utils/donationApi";
import Image from "next/image";
import Spinner from "@/components/spinner";

const paymentMethods = [
  {
    id: "bank",
    name: "Bank Transfer",
    accountInfo:
      "Bank: B.T.M.C. Foundation\nA/C Number: 2222410016305780\nSWIFT: NMBBNPKA\nBranch: Boudha Branch, Kathmandu, Nepal",
  },
  { id: "esewa", name: "eSewa", accountInfo: "eSewa ID: 9849118562" },
  { id: "khalti", name: "Khalti", accountInfo: "Khalti ID: 9849118562" },
];

export default function DonatePage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id
  );
  const [donationType, setDonationType] = useState("one-time");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAmountSelect = (value: string) => {
    setAmount(value);
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
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Error", {
          description: "Please upload an image file",
        });
        return;
      }

      setScreenshot(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);

      // Update the file input for form validity
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  }, []);

  const removeScreenshot = useCallback(() => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      toast.error("Error", {
        description: "Please enter a donation amount",
      });
      return;
    }

    if (!name || !email || !phoneNumber) {
      toast.error("Error", {
        description: "Please fill in all required fields",
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
      const donationData = {
        name,
        email,
        phoneNumber,
        amount: parseFloat(amount),
        donationType,
        donationMethod: selectedPaymentMethod,
        page: "donate",
        pageTitle: "Donation Page",
      };

      await createDonation(donationData, screenshot);

      // Reset form after successful submission
      setAmount("");
      setName("");
      setEmail("");
      setPhoneNumber("");
      setScreenshot(null);
      setScreenshotPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Donation submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Support Our Mission
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Your generous donation helps us continue spreading Buddhist teachings
        and practices.
      </motion.p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-saffron-50 border-saffron-200">
              <CardHeader>
                <CardTitle className="text-2xl text-crimson-700">
                  Choose Donation Amount
                </CardTitle>
                <CardDescription className="text-maroon-600">
                  Select a preset amount or enter a custom value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={amount}
                  onValueChange={handleAmountSelect}
                  className="grid grid-cols-3 gap-4 mb-4"
                >
                  {["10", "25", "50", "100", "250", "500"].map((value) => (
                    <Label
                      key={value}
                      className={`flex items-center justify-center p-4 border-2 ${
                        amount === value
                          ? "border-crimson-500 bg-saffron-100"
                          : "border-saffron-200"
                      } rounded-md cursor-pointer hover:bg-saffron-100 transition-colors`}
                    >
                      <RadioGroupItem value={value} className="sr-only" />$
                      {value}
                    </Label>
                  ))}
                </RadioGroup>
                <div className="mb-4">
                  <Label htmlFor="custom-amount" className="text-maroon-700">
                    Custom Amount
                  </Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    className="mt-1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <Tabs
                  defaultValue="one-time"
                  value={donationType}
                  onValueChange={setDonationType}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-saffron-100">
                    <TabsTrigger
                      value="one-time"
                      className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                    >
                      One-time
                    </TabsTrigger>
                    <TabsTrigger
                      value="monthly"
                      className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                    >
                      Monthly
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="one-time">
                    <p className="text-maroon-700 mb-2">
                      Make a one-time donation to support our cause.
                    </p>
                  </TabsContent>
                  <TabsContent value="monthly">
                    <p className="text-maroon-700 mb-2">
                      Set up a recurring monthly donation to provide ongoing
                      support.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            ref={ref}
          >
            <Card className="bg-saffron-50 border-saffron-200">
              <CardHeader>
                <CardTitle className="text-2xl text-crimson-700">
                  Donor Information
                </CardTitle>
                <CardDescription className="text-maroon-600">
                  Enter your details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="name" className="text-maroon-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your Fullname"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="email" className="text-maroon-700">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    className="mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="phone" className="text-maroon-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    className="mt-1"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label className="text-maroon-700">Payment Method *</Label>
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                    className="mt-2"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id}>{method.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="mb-4 p-4 bg-saffron-100 rounded-md">
                  <h4 className="font-semibold mb-2">Account Information</h4>
                  <pre className="whitespace-pre-wrap text-sm">
                    {
                      paymentMethods.find((m) => m.id === selectedPaymentMethod)
                        ?.accountInfo
                    }
                  </pre>
                </div>
                <div className="mb-4">
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
                <Button
                  type="submit"
                  className="w-full bg-crimson-600 hover:bg-crimson-700 text-white"
                  disabled={isSubmitting}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {isSubmitting ? (
                    <Spinner text="Processing..." />
                  ) : (
                    "Donate Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </form>

      <SupportSection />

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-saffron-50 border-saffron-200">
          <CardHeader>
            <CardTitle className="text-2xl text-crimson-700">
              Other Ways to Donate
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-crimson-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-maroon-800">
                  Physical Donation
                </h3>
                <p className="text-maroon-600">
                  Make a physical donation to our office
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Banknote className="h-8 w-8 text-crimson-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-maroon-800">
                  Check by Mail
                </h3>
                <p className="text-maroon-600">Send to our mailing address</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Toaster />
    </div>
  );
}

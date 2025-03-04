"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Gift,
  BookOpen,
  Users,
  CreditCard,
  Banknote,
} from "lucide-react";
import { SupportSection } from "@/components/sections/support-section";

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
  },
];

const paymentMethods = [
  {
    id: "bank",
    name: "Bank Transfer",
    accountInfo: "Bank: ABC Bank\nAccount: 1234567890\nIFSC: ABCD0001234",
  },
  { id: "esewa", name: "eSewa", accountInfo: "eSewa ID: 9876543210" },
  { id: "khalti", name: "Khalti", accountInfo: "Khalti ID: 1234567890" },
];

export default function DonatePage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id
  );

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
                defaultValue="25"
                className="grid grid-cols-3 gap-4 mb-4"
              >
                {["10", "25", "50", "100", "250", "500"].map((amount) => (
                  <Label
                    key={amount}
                    className="flex items-center justify-center p-4 border-2 border-saffron-200 rounded-md cursor-pointer hover:bg-saffron-100 transition-colors"
                  >
                    <RadioGroupItem value={amount} className="sr-only" />$
                    {amount}
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
                />
              </div>
              <Tabs defaultValue="one-time" className="w-full">
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
              <form>
                <div className="mb-4">
                  <Label htmlFor="name" className="text-maroon-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your Fullname"
                    className="mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="email" className="text-maroon-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    className="mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="phone" className="text-maroon-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    className="mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Label className="text-maroon-700">Payment Method</Label>
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
                <Button className="w-full bg-crimson-600 hover:bg-crimson-700 text-white">
                  <Heart className="mr-2 h-4 w-4" /> Donate Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
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
import { Heart, CreditCard, Banknote } from "lucide-react";

export default function Donate() {
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
                Payment Information
              </CardTitle>
              <CardDescription className="text-maroon-600">
                Enter your payment details securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="mb-4">
                  <Label htmlFor="name" className="text-maroon-700">
                    Full Name
                  </Label>
                  <Input id="name" placeholder="John Doe" className="mt-1" />
                </div>
                <div className="mb-4">
                  <Label htmlFor="email" className="text-maroon-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="card" className="text-maroon-700">
                    Card Number
                  </Label>
                  <Input
                    id="card"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="expiry" className="text-maroon-700">
                      Expiry Date
                    </Label>
                    <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-maroon-700">
                      CVC
                    </Label>
                    <Input id="cvc" placeholder="123" className="mt-1" />
                  </div>
                </div>
                <Button className="w-full bg-crimson-600 hover:bg-crimson-700 text-white">
                  <Heart className="mr-2 h-4 w-4" /> Donate Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
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
                  Bank Transfer
                </h3>
                <p className="text-maroon-600">
                  Contact us for our bank details
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

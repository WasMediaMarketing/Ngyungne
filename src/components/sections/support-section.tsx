"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, BookOpen, Users } from "lucide-react";
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

export function SupportSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");

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
  };

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Here you would implement your payment processing logic
    setIsDialogOpen(false);
    alert("Thank you for your support!");
  };

  return (
    <section className="py-20 bg-muted/30">
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
          ref={ref}
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
                            setDonationAmount(amount);
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
                        Donation Amount
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
                      <FormLabel>Full Name</FormLabel>
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
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>Phone Number</FormLabel>
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
                        Payment Method
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
                                <p className="text-sm mb-2">
                                  Bank Account Details:
                                </p>
                                <p className="text-sm">
                                  Bank Name: Example Bank
                                </p>
                                <p className="text-sm">
                                  Account Name: Buddhist Center
                                </p>
                                <p className="text-sm">
                                  Account Number: 1234567890
                                </p>
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
                            {field.value === "khalti" && (
                              <div className="p-3 bg-gray-50">
                                <p className="text-sm mb-2">Khalti Payment:</p>
                                <p className="text-sm">
                                  You will be redirected to Khalti to complete
                                  your payment.
                                </p>
                                <p className="text-sm mt-2 text-gray-600">
                                  Khalti ID: buddhist.center@example.com
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
                                <p className="text-sm">
                                  You will be redirected to eSewa to complete
                                  your payment.
                                </p>
                                <p className="text-sm mt-2 text-gray-600">
                                  eSewa ID: 9876543210
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                >
                  Complete Support
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

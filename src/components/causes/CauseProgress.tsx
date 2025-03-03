"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Users, MapPin, Heart } from "lucide-react";
import { useState } from "react";
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

interface CauseProgressProps {
  cause: {
    title: string;
    raised: number;
    goal: number;
    startDate: string;
    endDate: string;
    volunteers: number;
    location: string;
    totalDonors: number;
  };
  onDonate?: () => void;
}

export function CauseProgress({ cause, onDonate }: CauseProgressProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>("50");

  const percentageRaised = Math.floor((cause.raised / cause.goal) * 100);

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(
      "en-US",
      options as Intl.DateTimeFormatOptions
    );
  };

  const form = useForm({
    defaultValues: {
      amount: "50",
      customAmount: "",
      fullName: "",
      email: "",
      phone: "",
      paymentMethod: "bank",
      receiveUpdates: true,
    },
  });

  const handleDonateClick = () => {
    if (onDonate) onDonate();
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Here you would implement your payment processing logic
    setIsDialogOpen(false);
    alert("Thank you for your donation!");
  };

  return (
    <>
      <div className="bg-saffron-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <div>
            <p className="text-lg font-medium text-maroon-800">Raised so far</p>
            <p className="text-3xl font-bold text-crimson-700">
              ${cause.raised.toLocaleString()}
            </p>
          </div>
          <div className="text-right mt-4 sm:mt-0">
            <p className="text-maroon-600">
              Goal: ${cause.goal.toLocaleString()}
            </p>
            <p className="text-lg font-medium text-maroon-700">
              {percentageRaised}% Complete
            </p>
          </div>
        </div>

        <div className="h-4 bg-gray-100 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-crimson-500 to-crimson-600 rounded-full"
            style={{ width: `${percentageRaised}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <CalendarDays className="mx-auto mb-2 h-6 w-6 text-crimson-600" />
            <p className="text-sm text-maroon-500">Duration</p>
            <p className="font-medium text-maroon-800">
              {formatDate(cause.startDate).split(",")[0]} -{" "}
              {formatDate(cause.endDate).split(",")[0]}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Users className="mx-auto mb-2 h-6 w-6 text-crimson-600" />
            <p className="text-sm text-maroon-500">Volunteers</p>
            <p className="font-medium text-maroon-800">{cause.volunteers}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <MapPin className="mx-auto mb-2 h-6 w-6 text-crimson-600" />
            <p className="text-sm text-maroon-500">Location</p>
            <p className="font-medium text-maroon-800">{cause.location}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Heart className="mx-auto mb-2 h-6 w-6 text-crimson-600" />
            <p className="text-sm text-maroon-500">Donors</p>
            <p className="font-medium text-maroon-800">{cause.totalDonors}</p>
          </div>
        </div>

        <Button
          onClick={handleDonateClick}
          className="w-full bg-crimson-600 text-white hover:bg-crimson-700 py-6 rounded-lg text-lg shadow-md transition-transform hover:translate-y-[-2px]"
        >
          <Heart className="mr-2 h-5 w-5" /> Donate Now
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-2">
              Support {cause.title || "Our Cause"}
            </DialogTitle>
            <DialogDescription className="text-center">
              Your donation helps us continue our important work. Thank you for
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
                    <FormItem className="space-y-2">
                      <FormLabel className="text-lg font-medium">
                        Select Donation Amount
                      </FormLabel>
                      <div className="grid grid-cols-4 gap-3">
                        {["25", "50", "100", "250"].map((amount) => (
                          <Button
                            type="button"
                            key={amount}
                            variant={
                              donationAmount === amount ? "default" : "outline"
                            }
                            className={`text-lg py-6 ${
                              donationAmount === amount
                                ? "bg-crimson-600 text-white"
                                : ""
                            }`}
                            onClick={() => {
                              setDonationAmount(amount);
                              field.onChange(amount);
                              form.setValue("customAmount", "");
                            }}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        Custom Amount
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            placeholder="Enter custom amount"
                            className="pl-8"
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                setDonationAmount("custom");
                                form.setValue("amount", "custom");
                              } else {
                                setDonationAmount("50");
                                form.setValue("amount", "50");
                              }
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
                                  Account Name: Charity Foundation
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
                          donation is helping
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
                  className="bg-crimson-600 hover:bg-crimson-700"
                >
                  Complete Donation
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

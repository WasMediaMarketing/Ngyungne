"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  getSettings,
  updateSettings,
  resetSettings,
} from "@/utils/settingsApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethodType } from "@/types/setting.types";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Spinner from "@/components/spinner";

// Define the validation schema using Zod
const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
});

const bankInfoSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  branchName: z.string().min(1, "Branch name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  qrCode: z.string().optional(),
});

const digitalWalletSchema = z.object({
  id: z.string().min(1, "ID is required"),
  qrCode: z.string().optional(),
});

const otherPaymentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  details: z.string().min(1, "Details are required"),
  qrCode: z.string().optional(),
});

const paymentInfoSchema = z.object({
  type: z.enum([
    PaymentMethodType.BANK,
    PaymentMethodType.ESEWA,
    PaymentMethodType.KHALTI,
    PaymentMethodType.OTHER,
  ]),
  bank: bankInfoSchema.optional(),
  digitalWallet: digitalWalletSchema.optional(),
  other: otherPaymentSchema.optional(),
  isActive: z.boolean().default(true),
});

const formSchema = z.object({
  organizationInfo: z.object({
    name: z.string().min(1, "Organization name is required"),
    address: z.string().min(1, "Address is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    socialLinks: z.array(socialLinkSchema).optional(),
  }),
  paymentInfo: z.array(paymentInfoSchema).optional(),
  metaInfo: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    keywords: z.array(z.string()).min(1, "At least one keyword is required"),
    ogImage: z.string().url("Must be a valid URL").optional(),
    favicon: z.string().url("Must be a valid URL").optional(),
    twitterHandle: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationInfo: {
        name: "",
        address: "",
        email: "",
        phone: "",
        socialLinks: [],
      },
      paymentInfo: [],
      metaInfo: {
        title: "",
        description: "",
        keywords: [],
        ogImage: "",
        favicon: "",
        twitterHandle: "",
      },
    },
  });

  // Set up field arrays for social links and payment methods
  const {
    fields: socialLinksFields,
    append: appendSocialLink,
    remove: removeSocialLink,
  } = useFieldArray({
    control: form.control,
    name: "organizationInfo.socialLinks",
  });

  const {
    fields: paymentInfoFields,
    append: appendPaymentInfo,
    remove: removePaymentInfo,
  } = useFieldArray({
    control: form.control,
    name: "paymentInfo",
  });

  // Fetch settings on component mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const settings = await getSettings();

        // Format keywords as an array if it's a string
        if (
          settings.metaInfo.keywords &&
          typeof settings.metaInfo.keywords === "string"
        ) {
          settings.metaInfo.keywords = (
            settings.metaInfo.keywords as unknown as string
          ).split(",");
        }

        // Reset form with fetched settings
        form.reset({
          organizationInfo: settings.organizationInfo,
          paymentInfo: settings.paymentInfo || [],
          metaInfo: settings.metaInfo,
        });

        toast.success("Settings loaded successfully");
      } catch (error) {
        toast.error("Error", {
          description: "Failed to fetch settings",
        });
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [form]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);

      // Process keywords if they're a comma-separated string
      if (typeof data.metaInfo.keywords === "string") {
        data.metaInfo.keywords = (data.metaInfo.keywords as unknown as string)
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean);
      }

      // Validate payment info based on type
      data.paymentInfo?.forEach((payment) => {
        if (payment.type === PaymentMethodType.BANK && !payment.bank) {
          throw new Error(
            "Bank information is required for bank payment method"
          );
        } else if (
          (payment.type === PaymentMethodType.ESEWA ||
            payment.type === PaymentMethodType.KHALTI) &&
          !payment.digitalWallet
        ) {
          throw new Error(
            `${payment.type} information is required for ${payment.type} payment method`
          );
        } else if (payment.type === PaymentMethodType.OTHER && !payment.other) {
          throw new Error(
            "Payment details are required for other payment method"
          );
        }
      });

      await updateSettings(data as FormValues);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to update settings",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reset to defaults
  const handleReset = async () => {
    try {
      setSubmitting(true);
      const result = await resetSettings();

      // Fetch the updated settings after reset
      const settings = await getSettings();
      form.reset({
        organizationInfo: settings.organizationInfo,
        paymentInfo: settings.paymentInfo || [],
        metaInfo: settings.metaInfo,
      });

      toast.success("Settings reset successfully");
    } catch (error) {
      toast.error("Error", {
        description: "Failed to reset settings",
      });
    } finally {
      setSubmitting(false);
      setResetDialogOpen(false);
    }
  };

  // Helper function to add a new payment method
  const addPaymentMethod = (type: PaymentMethodType) => {
    const newPayment = {
      type,
      isActive: true,
    } as any;

    // Add the appropriate payment details based on type
    if (type === PaymentMethodType.BANK) {
      newPayment.bank = {
        accountName: "",
        branchName: "",
        bankName: "",
        accountNumber: "",
        qrCode: "",
      };
    } else if (
      type === PaymentMethodType.ESEWA ||
      type === PaymentMethodType.KHALTI
    ) {
      newPayment.digitalWallet = {
        id: "",
        qrCode: "",
      };
    } else if (type === PaymentMethodType.OTHER) {
      newPayment.other = {
        name: "",
        details: "",
        qrCode: "",
      };
    }

    appendPaymentInfo(newPayment);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="organization" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              <TabsTrigger value="meta">Website Meta</TabsTrigger>
            </TabsList>

            {/* Organization Info Tab */}
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Information</CardTitle>
                  <CardDescription>
                    Manage your organization's basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="organizationInfo.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter organization name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationInfo.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Social Links</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          appendSocialLink({ platform: "", url: "" })
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Social Link
                      </Button>
                    </div>

                    {socialLinksFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-start">
                        <FormField
                          control={form.control}
                          name={`organizationInfo.socialLinks.${index}.platform`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Platform (e.g., Facebook)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`organizationInfo.socialLinks.${index}.url`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="URL" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeSocialLink(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Configure payment methods for your organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addPaymentMethod(PaymentMethodType.BANK)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bank
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addPaymentMethod(PaymentMethodType.ESEWA)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add eSewa
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addPaymentMethod(PaymentMethodType.KHALTI)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Khalti
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addPaymentMethod(PaymentMethodType.OTHER)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Other
                    </Button>
                  </div>

                  {paymentInfoFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No payment methods added yet. Add a payment method to get
                      started.
                    </div>
                  )}

                  {paymentInfoFields.map((field, index) => (
                    <Card key={field.id} className="border border-muted">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {form.watch(`paymentInfo.${index}.type`)} Payment
                          </CardTitle>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removePaymentInfo(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`paymentInfo.${index}.isActive`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4"
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Active
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        {form.watch(`paymentInfo.${index}.type`) ===
                          PaymentMethodType.BANK && (
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.bank.accountName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter account name"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.bank.bankName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bank Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter bank name"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.bank.branchName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Branch Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter branch name"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.bank.accountNumber`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter account number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.bank.qrCode`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>QR Code URL (Optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter QR code URL"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {(form.watch(`paymentInfo.${index}.type`) ===
                          PaymentMethodType.ESEWA ||
                          form.watch(`paymentInfo.${index}.type`) ===
                            PaymentMethodType.KHALTI) && (
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.digitalWallet.id`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {form.watch(`paymentInfo.${index}.type`) ===
                                    PaymentMethodType.ESEWA
                                      ? "eSewa ID"
                                      : "Khalti ID"}
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.digitalWallet.qrCode`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>QR Code URL (Optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter QR code URL"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {form.watch(`paymentInfo.${index}.type`) ===
                          PaymentMethodType.OTHER && (
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.other.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Payment Method Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter payment method name"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.other.details`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Details</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter payment details"
                                      {...field}
                                      rows={3}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`paymentInfo.${index}.other.qrCode`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>QR Code URL (Optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter QR code URL"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Website Meta Tab */}
            <TabsContent value="meta">
              <Card>
                <CardHeader>
                  <CardTitle>Website Meta Information</CardTitle>
                  <CardDescription>
                    Configure SEO and meta information for your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="metaInfo.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter website title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaInfo.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter website description"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of your website for search engines
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaInfo.keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter keywords separated by commas"
                            value={
                              Array.isArray(field.value)
                                ? field.value.join(", ")
                                : field.value
                            }
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>
                          Keywords help search engines understand your content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaInfo.ogImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open Graph Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Image displayed when sharing your website on social
                          media
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaInfo.favicon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favicon URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter favicon URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Small icon displayed in browser tabs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaInfo.twitterHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Handle</FormLabel>
                        <FormControl>
                          <Input placeholder="@username" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your Twitter username for Twitter card metadata
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-between">
            <AlertDialog
              open={resetDialogOpen}
              onOpenChange={setResetDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Reset to Defaults
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will reset all settings to their default values.
                    This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner text="Resetting..." />
                      </>
                    ) : (
                      "Reset Settings"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <Spinner text="Saving..." />
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

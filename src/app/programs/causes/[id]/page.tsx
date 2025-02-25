"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Users, Target, Heart } from "lucide-react";

const causes = [
  {
    id: 1,
    title: "Temple Renovation",
    description: "Help us restore and maintain our sacred temple spaces.",
    goal: 50000,
    raised: 35000,
    image: "/placeholder.svg?height=400&width=800",
    longDescription:
      "Our ancient temples are in need of restoration to preserve their beauty and spiritual significance. Your support will help us maintain these sacred spaces for future generations. The renovation project includes structural repairs, restoration of ancient murals, and upgrading facilities to accommodate more practitioners.",
    impact:
      "By contributing to this cause, you'll help preserve our cultural heritage, provide a space for spiritual practice, and support the local community that relies on these temples. Your donation will ensure that these sacred spaces continue to inspire and serve practitioners for generations to come.",
    updates: [
      {
        date: "2025-03-01",
        content:
          "Renovation of the main hall has begun. The team has started carefully removing old paint to reveal original murals.",
      },
      {
        date: "2025-02-15",
        content:
          "Architectural plans have been finalized. We're excited to share that the renovation will include a new meditation garden.",
      },
      {
        date: "2025-01-30",
        content:
          "Fundraising milestone reached! We've secured 70% of our goal thanks to your generous support.",
      },
    ],
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    volunteers: 50,
    location: "Dharamshala, India",
  },
  // Add other causes here...
];

export default function CauseDetail() {
  const params = useParams();
  const cause = causes.find((c) => c.id === Number(params.id));
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (!cause) {
    return <div>Cause not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-saffron-50 border-saffron-200">
          <CardHeader>
            <CardTitle className="text-3xl text-crimson-800">
              {cause.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative mb-6 rounded-lg overflow-hidden">
              <Image
                src={cause.image || "/placeholder.svg"}
                alt={cause.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-xl text-maroon-700 mb-6">{cause.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-maroon-700">
                <CalendarDays className="mr-2 h-5 w-5" />
                <span>
                  Duration: {cause.startDate} - {cause.endDate}
                </span>
              </div>
              <div className="flex items-center text-maroon-700">
                <Users className="mr-2 h-5 w-5" />
                <span>Volunteers: {cause.volunteers}</span>
              </div>
              <div className="flex items-center text-maroon-700">
                <Target className="mr-2 h-5 w-5" />
                <span>Location: {cause.location}</span>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-maroon-700">
                <span>Raised: ${cause.raised.toLocaleString()}</span>
                <span>Goal: ${cause.goal.toLocaleString()}</span>
              </div>
              <Progress
                value={(cause.raised / cause.goal) * 100}
                className="h-3 bg-saffron-200"
              />
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="w-full bg-crimson-600 text-white hover:bg-crimson-700">
                    <Heart className="mr-2 h-4 w-4" /> Donate Now
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-saffron-50">
                  <SheetHeader>
                    <SheetTitle className="text-crimson-800">
                      Donate to {cause.title}
                    </SheetTitle>
                    <SheetDescription className="text-maroon-600">
                      Your generous donation will help us achieve our goal of $
                      {cause.goal.toLocaleString()}.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-maroon-700">
                        Donation Amount
                      </Label>
                      <RadioGroup
                        defaultValue="25"
                        className="grid grid-cols-3 gap-4"
                      >
                        {["10", "25", "50", "100", "250", "500"].map(
                          (amount) => (
                            <Label
                              key={amount}
                              className="flex items-center justify-center p-4 border-2 border-saffron-200 rounded-md cursor-pointer hover:bg-saffron-100 transition-colors"
                            >
                              <RadioGroupItem
                                value={amount}
                                className="sr-only"
                              />
                              ${amount}
                            </Label>
                          )
                        )}
                      </RadioGroup>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Custom amount"
                        className="mt-2"
                      />
                    </div>
                    <Separator className="bg-saffron-200" />
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-maroon-700">
                        Full Name
                      </Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-maroon-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                      />
                    </div>
                    <Button className="w-full bg-crimson-600 text-white hover:bg-crimson-700">
                      Complete Donation
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-saffron-100">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="impact"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  Impact
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  Updates
                </TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <Card className="bg-white border-saffron-200">
                  <CardContent className="pt-6">
                    <p className="text-maroon-700">{cause.longDescription}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="impact">
                <Card className="bg-white border-saffron-200">
                  <CardContent className="pt-6">
                    <p className="text-maroon-700">{cause.impact}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="updates">
                <Card className="bg-white border-saffron-200">
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      {cause.updates.map((update, index) => (
                        <li
                          key={index}
                          className="border-b border-saffron-200 pb-4"
                        >
                          <p className="font-semibold text-crimson-700">
                            {update.date}
                          </p>
                          <p className="text-maroon-600">{update.content}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

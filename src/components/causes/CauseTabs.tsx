import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { CauseUI } from "@/utils/causeApi";
import { useState, useEffect } from "react";

interface CauseTabsProps {
  cause: CauseUI;
}

export function CauseTabs({ cause }: CauseTabsProps) {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-saffron-100 p-1 mb-2">
        <TabsTrigger
          value="about"
          className="data-[state=active]:bg-white data-[state=active]:text-crimson-800 data-[state=active]:shadow-sm rounded-md"
        >
          About
        </TabsTrigger>
        <TabsTrigger
          value="impact"
          className="data-[state=active]:bg-white data-[state=active]:text-crimson-800 data-[state=active]:shadow-sm rounded-md"
        >
          Impact
        </TabsTrigger>
        <TabsTrigger
          value="updates"
          className="data-[state=active]:bg-white data-[state=active]:text-crimson-800 data-[state=active]:shadow-sm rounded-md"
        >
          Updates
        </TabsTrigger>
        <TabsTrigger
          value="faq"
          className="data-[state=active]:bg-white data-[state=active]:text-crimson-800 data-[state=active]:shadow-sm rounded-md"
        >
          FAQ
        </TabsTrigger>
      </TabsList>

      <TabsContent value="about" className="mt-0">
        <Card className="bg-white border-0 shadow-none">
          <CardContent className="p-0 space-y-6">
            <div
              className="prose max-w-none text-maroon-700"
              dangerouslySetInnerHTML={{ __html: cause.about.longDescription }}
            ></div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-crimson-800 mb-4">
                Project Objectives
              </h3>
              <ul className="space-y-3">
                {cause.about.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-crimson-600 flex-shrink-0 mt-0.5" />
                    <span className="text-maroon-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="impact" className="mt-0">
        <Card className="bg-white border-0 shadow-none">
          <CardContent className="p-0">
            <div
              className="prose max-w-none text-maroon-700"
              dangerouslySetInnerHTML={{ __html: cause.impact }}
            ></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="updates" className="mt-0">
        <Card className="bg-white border-0 shadow-none">
          <CardContent className="p-0 space-y-6">
            {typeof cause.updates === "string" &&
              cause.updates.includes("<") && (
                <div
                  className="prose max-w-none text-maroon-700 mt-4"
                  dangerouslySetInnerHTML={{ __html: cause.updates }}
                ></div>
              )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="faq" className="mt-0">
        <Card className="bg-white border-0 shadow-none">
          <CardContent className="p-0 space-y-4">
            {cause.faq && cause.faq.length > 0 ? (
              cause.faq.map((item, index) => (
                <div key={index} className="bg-saffron-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-crimson-800 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-maroon-700">{item.answer}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-maroon-600">
                  No FAQs available for this cause.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollText } from "lucide-react";
import OverviewTab from "@/components/scripture/tabs/OverviewTab";
import VersesTab from "@/components/scripture/tabs/VersesTab"; // ✅ Corrected import
import HistoricalTab from "@/components/scripture/tabs/HistoricalTab";
import StudyGuideTab from "@/components/scripture/tabs/StudyGuidTab"; // ✅ Corrected typo in import
import TranslationsTab from "@/components/scripture/tabs/TranslationTab";
import { Scripture } from "@/data/scripture";

interface ScriptureContentProps {
  scripture: Scripture;
}

export default function ScriptureContent({ scripture }: ScriptureContentProps) {
  const [currentTab, setCurrentTab] = useState("overview");

  return (
    <Card className="bg-white border-saffron-200 shadow-md">
      <CardHeader className="border-b border-saffron-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <ScrollText className="h-8 w-8 text-crimson-600" />
          <div>
            <CardTitle className="text-3xl text-crimson-700">
              {scripture.title}
            </CardTitle>
          </div>
        </div>

        {/* Navigation tabs */}
        <Tabs
          defaultValue="overview"
          value={currentTab}
          onValueChange={setCurrentTab}
          className="mt-4"
        >
          <TabsList className="bg-saffron-100 p-1 rounded-lg w-full grid grid-cols-3 md:grid-cols-5">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="verses"
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              Verses
            </TabsTrigger>
            <TabsTrigger
              value="historical"
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              Historical
            </TabsTrigger>
            <TabsTrigger
              value="study"
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              Study Guide
            </TabsTrigger>
            <TabsTrigger
              value="translations"
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              Translations
            </TabsTrigger>
          </TabsList>

          {/* ✅ Moved `TabsContent` inside `Tabs` */}
          <CardContent className="pt-6">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab scripture={scripture} />
            </TabsContent>
            <TabsContent value="verses" className="mt-0">
              <VersesTab scripture={scripture} />
            </TabsContent>
            <TabsContent value="historical" className="mt-0">
              <HistoricalTab scripture={scripture} />
            </TabsContent>
            <TabsContent value="study" className="mt-0">
              <StudyGuideTab scripture={scripture} />
            </TabsContent>
            <TabsContent value="translations" className="mt-0">
              <TranslationsTab scripture={scripture} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}

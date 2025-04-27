"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { AboutHeroEditor } from "@/components/admin/about/AboutHeroEditor";
import StatisticsEditor from "@/components/admin/about/StatisticsEditor";
import HistoryEditor from "@/components/admin/about/HistoryEditor";
import PracticeEditor from "@/components/admin/about/PracticeEditor";
import BenefitsEditor from "@/components/admin/about/BenefitsEditor";
import CTAEditor from "@/components/admin/about/CTAEditor";
import { aboutApi } from "@/utils/aboutApi";
import {
  ContentType,
  type IHeroSection,
  type IHistoryItem,
  type IPracticeItem,
  type IBenefitItem,
  type IStatistic,
  type ICTASection,
  type IAboutContent,
} from "@/types/about.types";

export default function AboutAdminPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State for each section
  const [heroSection, setHeroSection] = useState<IHeroSection>({
    title: "Discover the Ancient Practice of Ngyungne",
    description:
      "Ngyungne is a profound fasting and purification practice associated with Avalokiteshvara, the Buddha of Compassion.",
    imageUrl: "/placeholder.svg?height=600&width=800",
  });

  const [statistics, setStatistics] = useState<IStatistic[]>([
    {
      title: "Years of Tradition",
      value: "1000+",
      icon: "calendar",
      description: "",
    },
    {
      title: "Practitioners Worldwide",
      value: "10000+",
      icon: "users",
      description: "",
    },
    {
      title: "Qualified Teachers",
      value: "100+",
      icon: "book",
      description: "",
    },
    {
      title: "Countries Reached",
      value: "50+",
      icon: "globe",
      description: "",
    },
  ]);

  const [historyItems, setHistoryItems] = useState<IHistoryItem[]>([]);
  const [practiceItems, setPracticeItems] = useState<IPracticeItem[]>([]);
  const [benefitItems, setBenefitItems] = useState<IBenefitItem[]>([]);
  const [ctaSection, setCTASection] = useState<ICTASection>({
    title: "Ready to Experience Ngyungne?",
    description:
      "Embark on a transformative journey through our upcoming retreats or learn how to incorporate this profound practice into your daily life.",
    primaryButtonText: "Explore Our Retreats",
    primaryButtonUrl: "/programs/retreats",
    secondaryButtonText: "Read Our Blog",
    secondaryButtonUrl: "/resources/blog",
  });

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch hero section
        const heroData = await aboutApi.getHeroSection();
        if (heroData) {
          setHeroSection(heroData);
        }

        // Fetch statistics
        const statsData = await aboutApi.getAboutContents(
          ContentType.STATISTIC,
          true
        );
        if (statsData && statsData.length > 0) {
          setStatistics(statsData.map((item: IAboutContent) => item.data));
        }

        // Fetch history items
        const historyData = await aboutApi.getAboutContents(
          ContentType.HISTORY,
          true
        );
        if (historyData && historyData.length > 0) {
          setHistoryItems(
            historyData.map((item: IAboutContent) => ({
              ...item.data,
              _id: item._id,
            }))
          );
        }

        // Fetch practice items
        const practiceData = await aboutApi.getAboutContents(
          ContentType.PRACTICE,
          true
        );
        if (practiceData && practiceData.length > 0) {
          setPracticeItems(
            practiceData.map((item: IAboutContent) => ({
              ...item.data,
              _id: item._id,
            }))
          );
        }

        // Fetch benefit items
        const benefitData = await aboutApi.getAboutContents(
          ContentType.BENEFIT,
          true
        );
        if (benefitData && benefitData.length > 0) {
          setBenefitItems(
            benefitData.map((item: IAboutContent) => ({
              ...item.data,
              _id: item._id,
            }))
          );
        }

        // Fetch CTA section
        const ctaData = await aboutApi.getAboutContents(ContentType.CTA, true);
        if (ctaData && ctaData.length > 0) {
          setCTASection(ctaData[0].data);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        toast({
          title: "Error",
          description: "Failed to load about page data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Save hero section
  const saveHeroSection = async (): Promise<void> => {
    try {
      await aboutApi.updateHeroSection(heroSection);
      toast({
        title: "Success",
        description: "Hero section updated successfully",
      });
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast({
        title: "Error",
        description: "Failed to update hero section",
        variant: "destructive",
      });
    }
  };

  // Save statistics
  const saveStatistics = async (): Promise<void> => {
    try {
      // First get existing statistics to update or delete
      const existingStats = await aboutApi.getAboutContents(
        ContentType.STATISTIC
      );

      // Create a map of existing stats by index
      const existingStatsMap = new Map();
      existingStats.forEach((stat: IAboutContent, index: number) => {
        existingStatsMap.set(index, stat);
      });

      // Update or create statistics
      for (let i = 0; i < statistics.length; i++) {
        const statData = statistics[i];
        if (existingStatsMap.has(i)) {
          // Update existing
          const existingStat = existingStatsMap.get(i);
          await aboutApi.updateAboutContent(existingStat._id.toString(), {
            title: `Statistic ${i + 1}`,
            description: `Statistic ${i + 1} description`,
            contentType: ContentType.STATISTIC,
            order: i,
            isVisible: true,
            data: statData,
          });
          existingStatsMap.delete(i);
        } else {
          // Create new
          await aboutApi.createAboutContent({
            title: `Statistic ${i + 1}`,
            description: `Statistic ${i + 1} description`,
            contentType: ContentType.STATISTIC,
            order: i,
            isVisible: true,
            data: statData,
          } as IAboutContent);
        }
      }

      // Delete any remaining stats that weren't updated
      for (const [_, stat] of existingStatsMap.entries()) {
        await aboutApi.deleteAboutContent(stat._id.toString());
      }

      toast({
        title: "Success",
        description: "Statistics updated successfully",
      });
    } catch (error) {
      console.error("Error saving statistics:", error);
      toast({
        title: "Error",
        description: "Failed to update statistics",
        variant: "destructive",
      });
    }
  };

  // Save history items
  const saveHistoryItems = async (): Promise<void> => {
    try {
      // First get existing history items to update or delete
      const existingItems = await aboutApi.getAboutContents(
        ContentType.HISTORY
      );

      // Create a map of existing items by ID
      const existingItemsMap = new Map();
      existingItems.forEach((item: IAboutContent) => {
        existingItemsMap.set(item._id.toString(), item);
      });

      // Update or create history items
      for (let i = 0; i < historyItems.length; i++) {
        const item = historyItems[i];
        if (item._id && existingItemsMap.has(item._id.toString())) {
          // Update existing
          await aboutApi.updateAboutContent(item._id.toString(), {
            title: item.title,
            description: item.description,
            contentType: ContentType.HISTORY,
            order: i,
            isVisible: true,
            data: {
              title: item.title,
              description: item.description,
              year: item.year,
              order: i,
              isLeftSide: item.isLeftSide,
            },
          });
          existingItemsMap.delete(item._id.toString());
        } else {
          // Create new
          await aboutApi.createAboutContent({
            title: item.title,
            description: item.description,
            contentType: ContentType.HISTORY,
            order: i,
            isVisible: true,
            data: {
              title: item.title,
              description: item.description,
              year: item.year,
              order: i,
              isLeftSide: item.isLeftSide,
            },
          } as IAboutContent);
        }
      }

      // Delete any remaining items that weren't updated
      for (const [id, _] of existingItemsMap.entries()) {
        await aboutApi.deleteAboutContent(id);
      }

      toast({
        title: "Success",
        description: "History items updated successfully",
      });
    } catch (error) {
      console.error("Error saving history items:", error);
      toast({
        title: "Error",
        description: "Failed to update history items",
        variant: "destructive",
      });
    }
  };

  // Save practice items
  const savePracticeItems = async (): Promise<void> => {
    try {
      // First get existing practice items to update or delete
      const existingItems = await aboutApi.getAboutContents(
        ContentType.PRACTICE
      );

      // Create a map of existing items by ID
      const existingItemsMap = new Map();
      existingItems.forEach((item: IAboutContent) => {
        existingItemsMap.set(item._id.toString(), item);
      });

      // Update or create practice items
      for (let i = 0; i < practiceItems.length; i++) {
        const item = practiceItems[i];
        if (item._id && existingItemsMap.has(item._id.toString())) {
          // Update existing
          await aboutApi.updateAboutContent(item._id.toString(), {
            title: item.title,
            description: item.description,
            contentType: ContentType.PRACTICE,
            order: i,
            isVisible: true,
            icon: item.icon,
            data: item,
          });
          existingItemsMap.delete(item._id.toString());
        } else {
          // Create new
          await aboutApi.createAboutContent({
            title: item.title,
            description: item.description,
            contentType: ContentType.PRACTICE,
            order: i,
            isVisible: true,
            icon: item.icon,
            data: item,
          } as IAboutContent);
        }
      }

      // Delete any remaining items that weren't updated
      for (const [id, _] of existingItemsMap.entries()) {
        await aboutApi.deleteAboutContent(id);
      }

      toast({
        title: "Success",
        description: "Practice items updated successfully",
      });
    } catch (error) {
      console.error("Error saving practice items:", error);
      toast({
        title: "Error",
        description: "Failed to update practice items",
        variant: "destructive",
      });
    }
  };

  // Save benefit items
  const saveBenefitItems = async (): Promise<void> => {
    try {
      // First get existing benefit items to update or delete
      const existingItems = await aboutApi.getAboutContents(
        ContentType.BENEFIT
      );

      // Create a map of existing items by ID
      const existingItemsMap = new Map();
      existingItems.forEach((item: IAboutContent) => {
        existingItemsMap.set(item._id.toString(), item);
      });

      // Update or create benefit items
      for (let i = 0; i < benefitItems.length; i++) {
        const item = benefitItems[i];
        if (item._id && existingItemsMap.has(item._id.toString())) {
          // Update existing
          await aboutApi.updateAboutContent(item._id.toString(), {
            title: item.title,
            description: `${item.title} benefits`,
            contentType: ContentType.BENEFIT,
            order: i,
            isVisible: true,
            icon: item.icon,
            data: item,
          });
          existingItemsMap.delete(item._id.toString());
        } else {
          // Create new
          await aboutApi.createAboutContent({
            title: item.title,
            description: `${item.title} benefits`,
            contentType: ContentType.BENEFIT,
            order: i,
            isVisible: true,
            icon: item.icon,
            data: item,
          } as IAboutContent);
        }
      }

      // Delete any remaining items that weren't updated
      for (const [id, _] of existingItemsMap.entries()) {
        await aboutApi.deleteAboutContent(id);
      }

      toast({
        title: "Success",
        description: "Benefit items updated successfully",
      });
    } catch (error) {
      console.error("Error saving benefit items:", error);
      toast({
        title: "Error",
        description: "Failed to update benefit items",
        variant: "destructive",
      });
    }
  };

  // Save CTA section
  const saveCTASection = async (): Promise<void> => {
    try {
      // First get existing CTA items
      const existingItems = await aboutApi.getAboutContents(ContentType.CTA);

      if (existingItems && existingItems.length > 0) {
        // Update existing
        await aboutApi.updateAboutContent(existingItems[0]._id.toString(), {
          title: ctaSection.title,
          description: ctaSection.description,
          contentType: ContentType.CTA,
          order: 0,
          isVisible: true,
          data: ctaSection,
        });
      } else {
        // Create new
        await aboutApi.createAboutContent({
          title: ctaSection.title,
          description: ctaSection.description,
          contentType: ContentType.CTA,
          order: 0,
          isVisible: true,
          data: ctaSection,
        } as IAboutContent);
      }

      toast({
        title: "Success",
        description: "CTA section updated successfully",
      });
    } catch (error) {
      console.error("Error saving CTA section:", error);
      toast({
        title: "Error",
        description: "Failed to update CTA section",
        variant: "destructive",
      });
    }
  };

  // Save all sections
  const saveAllSections = async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveHeroSection(),
        saveStatistics(),
        saveHistoryItems(),
        savePracticeItems(),
        saveBenefitItems(),
        saveCTASection(),
      ]);

      toast({
        title: "Success",
        description: "All about page sections updated successfully",
      });
    } catch (error) {
      console.error("Error saving all sections:", error);
      toast({
        title: "Error",
        description: "Failed to update some sections",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Function to refresh hero data
  const refreshHeroData = async () => {
    try {
      const heroData = await aboutApi.getHeroSection();
      if (heroData) {
        setHeroSection(heroData);
      }
    } catch (error) {
      console.error("Error refreshing hero data:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading about page data...</span>
      </div>
    );
  }
  console.log("heroSection", heroSection);
  console.log("statistics", statistics);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">About Page Editor</h1>
        <Button onClick={saveAllSections} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving All Sections...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Sections
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <AboutHeroEditor heroData={heroSection} onUpdate={refreshHeroData} />
        </TabsContent>

        <TabsContent value="statistics">
          <StatisticsEditor
            statistics={statistics}
            onUpdate={setStatistics}
            onSave={saveStatistics}
          />
        </TabsContent>

        <TabsContent value="history">
          <HistoryEditor
            historyItems={historyItems}
            onUpdate={setHistoryItems}
            onSave={saveHistoryItems}
          />
        </TabsContent>

        <TabsContent value="practice">
          <PracticeEditor
            practiceItems={practiceItems}
            onUpdate={setPracticeItems}
            onSave={savePracticeItems}
          />
        </TabsContent>

        <TabsContent value="benefits">
          <BenefitsEditor
            benefitItems={benefitItems}
            onUpdate={setBenefitItems}
            onSave={saveBenefitItems}
          />
        </TabsContent>

        <TabsContent value="cta">
          <CTAEditor
            ctaData={ctaSection}
            onUpdate={setCTASection}
            onSave={saveCTASection}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={saveAllSections} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Saving All Changes...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

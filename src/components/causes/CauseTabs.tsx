import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface CauseTabsProps {
  cause: {
    longDescription: string;
    objectives: string[];
    impact: string;
    updates: Array<{
      date: string;
      title: string;
      content: string;
      image: string;
    }>;
    faq: Array<{
      question: string;
      answer: string;
    }>;
  };
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
              dangerouslySetInnerHTML={{ __html: cause.longDescription }}
            ></div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-crimson-800 mb-4">
                Project Objectives
              </h3>
              <ul className="space-y-3">
                {cause.objectives.map((objective, index) => (
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
            {cause.updates.map((update, index) => (
              <div key={index} className="bg-saffron-50 rounded-lg p-6">
                <p className="text-sm text-maroon-500 mb-2">{update.date}</p>
                <h3 className="text-xl font-semibold text-crimson-800 mb-3">
                  {update.title}
                </h3>
                <p className="text-maroon-700 mb-4">{update.content}</p>
                <img
                  src={update.image || "/placeholder.svg"}
                  alt={update.title}
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="faq" className="mt-0">
        <Card className="bg-white border-0 shadow-none">
          <CardContent className="p-0 space-y-4">
            {cause.faq.map((item, index) => (
              <div key={index} className="bg-saffron-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-crimson-800 mb-2">
                  {item.question}
                </h3>
                <p className="text-maroon-700">{item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

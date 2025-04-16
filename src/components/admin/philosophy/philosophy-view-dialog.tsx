"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Quote, Lightbulb } from "lucide-react";
import type { IPhilosophyTopic } from "@/types";

interface PhilosophyViewDialogProps {
  topic: IPhilosophyTopic;
  open: boolean;
  onClose: () => void;
}

export default function PhilosophyViewDialog({
  topic,
  open,
  onClose,
}: PhilosophyViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{topic.icon}</span>
            <span>{topic.title}</span>
            <Badge
              variant={topic.isVisible ? "outline" : "secondary"}
              className="ml-2"
            >
              {topic.isVisible ? (
                <>
                  <Eye className="h-3 w-3 mr-1" /> Visible
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3 mr-1" /> Hidden
                </>
              )}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotes">
              <Quote className="h-4 w-4 mr-2" />
              Quotes ({topic.quotes?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="practices">
              <Lightbulb className="h-4 w-4 mr-2" />
              Practices ({topic.practices?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground">{topic.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Content</h3>
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: topic.content }}
              />
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            {topic.quotes && topic.quotes.length > 0 ? (
              topic.quotes.map((quote, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-md bg-muted/30 space-y-2"
                >
                  <blockquote className="italic text-lg">
                    "{quote.text}"
                  </blockquote>
                  <div className="text-right font-medium">— {quote.author}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No quotes available for this topic.
              </div>
            )}
          </TabsContent>

          <TabsContent value="practices" className="space-y-4">
            {topic.practices && topic.practices.length > 0 ? (
              <div className="space-y-4">
                {topic.practices.map((practice, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md bg-muted/30 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <h4 className="font-medium">Practice {index + 1}</h4>
                    </div>
                    <p>{practice}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No practices available for this topic.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

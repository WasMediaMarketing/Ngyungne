import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Globe, Book, Bookmark, Download, Share2 } from "lucide-react";
import { Scripture } from "@/data/scripture";

interface ScriptureInfoProps {
  scripture: Scripture;
}

export default function ScriptureInfo({ scripture }: ScriptureInfoProps) {
  return (
    <Card className="bg-saffron-50 border-saffron-200 shadow-md sticky top-8">
      <CardHeader className="border-b border-saffron-200 bg-gradient-to-r from-saffron-100 to-amber-100">
        <div className="flex justify-between items-start mb-3">
          <CardTitle className="text-2xl text-crimson-700">
            {scripture.title}
          </CardTitle>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mb-3">
          {scripture.tradition}
        </span>
        <CardDescription className="text-maroon-600">
          {scripture.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <InfoItem icon={History} label="Period" value={scripture.period} />
        <InfoItem icon={Globe} label="Language" value={scripture.language} />
        <InfoItem
          icon={Book}
          label="Verses"
          value={`${scripture.verses.length} key verses`}
        />

        <div className="pt-4">
          <h4 className="text-sm font-medium text-maroon-600 mb-3">Actions</h4>
          <div className="space-y-2">
            <ActionButton icon={Bookmark} label="Bookmark" />
            <ActionButton icon={Download} label="Download PDF" />
            <ActionButton icon={Share2} label="Share" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-crimson-600" />
      <div>
        <h4 className="text-sm font-medium text-maroon-600">{label}</h4>
        <p className="text-maroon-800">{value}</p>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
}

function ActionButton({ icon: Icon, label }: ActionButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start text-crimson-600 border-crimson-200"
    >
      <Icon className="mr-2 h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}

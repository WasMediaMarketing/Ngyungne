import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RelatedEntriesProps {
  entryType: string;
}

export default function RelatedEntries({ entryType }: RelatedEntriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Entries</CardTitle>
        <CardDescription>
          Other {entryType} practices from your journal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-primary/60">
          <p>Related entries functionality coming soon</p>
          <Button variant="outline" className="mt-4">
            View All Entries
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { JournalEntry } from "@/types/practice-journal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import JournalEntryDetail from "@/components/practice-journal/JournalEntryDetail";
import RelatedEntries from "@/components/practice-journal/RelatedEntries";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { mockEntries } from "@/data/mock-entries";

export default function PracticeJournalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = params.id;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const foundEntry = mockEntries.find((entry) => entry.id === id);
        if (foundEntry) {
          setEntry(foundEntry);
          setEditedEntry(foundEntry);
        }
        setIsLoading(false);
      }, 500);
    };

    if (id) {
      fetchEntry();
    }
  }, [id]);

  const goBack = () => {
    router.push("/resources/practice-journal");
  };

  const handleSaveEdit = () => {
    if (editedEntry) {
      setEntry(editedEntry);
      setIsEditing(false);
      // In a real app, you would update the database here
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      // In a real app, you would delete from the database here
      goBack();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-64 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Entry Not Found</h1>
          <p className="mb-4">
            The journal entry you're looking for doesn't exist.
          </p>
          <Button onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={goBack} className="text-primary/70">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Button>
        </div>

        <JournalEntryDetail
          entry={entry}
          isEditing={isEditing}
          editedEntry={editedEntry}
          setEditedEntry={setEditedEntry}
          setIsEditing={setIsEditing}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />

        <RelatedEntries entryType={entry.type} />
      </motion.div>
    </div>
  );
}

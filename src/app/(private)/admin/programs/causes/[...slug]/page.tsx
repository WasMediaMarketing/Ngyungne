"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CauseForm from "@/components/admin/cause/cause-form";
import { causeApi, type CauseUI } from "@/utils/causeApi";
import { Loader } from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CausePage() {
  const params = useParams();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cause, setCause] = useState<CauseUI | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Determine if we're in edit mode or create mode
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const isEditMode = slug[0] === "edit" && slug.length > 1;
  const causeId = isEditMode ? slug[1] : null;

  useEffect(() => {
    // If we're in edit mode, fetch the cause data
    if (isEditMode && causeId) {
      const fetchCause = async () => {
        setIsLoading(true);
        try {
          const causeData = await causeApi.getCauseById(causeId);
          if (!causeData) {
            setError("Cause not found");
            return;
          }
          setCause(causeData);
        } catch (err) {
          console.error("Error fetching cause:", err);
          setError("Failed to load cause details");
        } finally {
          setIsLoading(false);
        }
      };

      fetchCause();
    }
  }, [isEditMode, causeId]);

  const handleSuccess = () => {
    setIsSuccess(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      // Navigate back to the cause list
      router.push("/admin/programs/causes");
    }, 3000);
  };

  const handleCancel = () => {
    // Navigate back to the cause list
    router.push("/admin/programs/causes");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
            <Button
              onClick={() => router.push("/admin/programs/causes")}
              className="mt-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Cause List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isEditMode ? `Edit Cause: ${cause?.title}` : "Add New Cause"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="p-4 bg-green-100 text-green-800 rounded-md">
              Cause {isEditMode ? "updated" : "created"} successfully!
            </div>
          ) : (
            <CauseForm
              cause={cause}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              placeholder="Start describing your cause..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

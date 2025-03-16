"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CauseForm from "@/components/admin/cause/cause-form";
import { useRouter } from "next/navigation";
export default function AddCausePage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const handleSuccess = () => {
    setIsSuccess(true);
    // Reset after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add New Cause</CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="p-4 bg-green-100 text-green-800 rounded-md">
              Cause created successfully!
            </div>
          ) : (
            <CauseForm
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

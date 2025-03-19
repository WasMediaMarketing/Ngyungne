import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Calendar,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Home,
} from "lucide-react";
import type { IJoinCourseData, ICourse, IUser } from "@/types";

interface CourseEnrollmentViewDialogProps {
  enrollment: IJoinCourseData;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function CourseEnrollmentViewDialog({
  enrollment,
  open,
  onClose,
  children,
}: CourseEnrollmentViewDialogProps) {
  // Helper functions to extract data from populated objects
  const getCourseTitle = (): string => {
    if (
      typeof enrollment.courseId === "object" &&
      enrollment.courseId !== null &&
      "title" in enrollment.courseId
    ) {
      return (enrollment.courseId as ICourse).title || "Unknown Course";
    }
    return "Unknown Course";
  };

  const getUserName = (): string => {
    if (
      typeof enrollment.userId === "object" &&
      enrollment.userId !== null &&
      "name" in enrollment.userId
    ) {
      return (enrollment.userId as IUser).name || "Unknown User";
    }
    return "Unknown User";
  };

  const getUserEmail = (): string => {
    if (
      typeof enrollment.userId === "object" &&
      enrollment.userId !== null &&
      "email" in enrollment.userId
    ) {
      return (enrollment.userId as IUser).email || "Unknown Email";
    }
    return "Unknown Email";
  };

  const getUserPhone = (): string => {
    if (
      typeof enrollment.userId === "object" &&
      enrollment.userId !== null &&
      "phoneNumber" in enrollment.userId
    ) {
      return (enrollment.userId as IUser).phoneNumber || "Unknown Phone";
    }
    return "Unknown Phone";
  };

  const getUserAddress = (): string => {
    if (
      typeof enrollment.userId === "object" &&
      enrollment.userId !== null &&
      "address" in enrollment.userId
    ) {
      return (enrollment.userId as IUser).address || "Unknown Address";
    }
    return "Unknown Address";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Enrollment Details</DialogTitle>
          <DialogDescription>
            Viewing details for enrollment in{" "}
            <span className="font-medium">{getCourseTitle()}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                Participant
              </h3>
              <p className="text-sm text-muted-foreground">{getUserName()}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </h3>
              <p className="text-sm text-muted-foreground">{getUserEmail()}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </h3>
              <p className="text-sm text-muted-foreground">{getUserPhone()}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Address
              </h3>
              <p className="text-sm text-muted-foreground">
                {getUserAddress()}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Educational Level
              </h3>
              <p className="text-sm text-muted-foreground">
                {enrollment.educationalLevel}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Experience
              </h3>
              <p className="text-sm text-muted-foreground">
                {enrollment.experience || "Not specified"}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Reason for Joining
              </h3>
              <p className="text-sm text-muted-foreground">
                {enrollment.reason}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Special Requirements
              </h3>
              <p className="text-sm text-muted-foreground">
                {enrollment.specialRequirement || "None specified"}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Enrollment Date
              </h3>
              <p className="text-sm text-muted-foreground">
                {enrollment.createdAt
                  ? format(new Date(enrollment.createdAt), "PPP 'at' p")
                  : "Unknown"}
              </p>
            </div>
          </div>

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

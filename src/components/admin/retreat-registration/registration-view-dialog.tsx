"use client";

import type React from "react";

import { format } from "date-fns";
import {
  User,
  Mail,
  Phone,
  Home,
  Utensils,
  MessageSquare,
  Bed,
  HeartPulse,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { IRegisterRetreatData, IRetreat, IUser } from "@/types";

interface RegistrationViewDialogProps {
  registration: IRegisterRetreatData;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function RegistrationViewDialog({
  registration,
  open,
  onClose,
  children,
}: RegistrationViewDialogProps) {
  // Helper function to get retreat title
  const getRetreatTitle = (): string => {
    if (
      typeof registration.retreatId === "object" &&
      registration.retreatId !== null &&
      "title" in registration.retreatId
    ) {
      return (registration.retreatId as IRetreat).title || "Unknown Retreat";
    }
    return "Unknown Retreat";
  };

  // Helper function to get user name
  const getUserName = (): string => {
    if (
      typeof registration.userId === "object" &&
      registration.userId !== null &&
      "name" in registration.userId
    ) {
      return (registration.userId as IUser).name || "Unknown User";
    }
    return "Unknown User";
  };

  // Helper function to get user email
  const getUserEmail = (): string => {
    if (
      typeof registration.userId === "object" &&
      registration.userId !== null &&
      "email" in registration.userId
    ) {
      return (registration.userId as IUser).email || "Unknown Email";
    }
    return "Unknown Email";
  };

  // Helper function to get user phone
  const getUserPhone = (): string => {
    if (
      typeof registration.userId === "object" &&
      registration.userId !== null &&
      "phoneNumber" in registration.userId
    ) {
      return (registration.userId as IUser).phoneNumber || "Unknown Phone";
    }
    return "Unknown Phone";
  };

  // Helper function to get user address
  const getUserAddress = (): string | undefined => {
    if (
      typeof registration.userId === "object" &&
      registration.userId !== null &&
      "address" in registration.userId
    ) {
      return (registration.userId as IUser).address;
    }
    return undefined;
  };

  // Helper function to get retreat date
  const getRetreatDate = (): string => {
    if (
      typeof registration.retreatId === "object" &&
      registration.retreatId !== null &&
      "date" in registration.retreatId
    ) {
      return (registration.retreatId as IRetreat).date || "Unknown Date";
    }
    return "Unknown Date";
  };

  // Helper function to get retreat location
  const getRetreatLocation = (): string => {
    if (
      typeof registration.retreatId === "object" &&
      registration.retreatId !== null &&
      "location" in registration.retreatId
    ) {
      return (
        (registration.retreatId as IRetreat).location || "Unknown Location"
      );
    }
    return "Unknown Location";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Registration Details</DialogTitle>
          <DialogDescription>
            Registration for {getRetreatTitle()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Participant
              </h3>
              <p className="text-sm flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                {getUserName()}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Retreat
              </h3>
              <p className="text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {getRetreatTitle()}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p className="text-sm flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                {getUserEmail()}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Phone
              </h3>
              <p className="text-sm flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                {getUserPhone()}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Retreat Date
              </h3>
              <p className="text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {getRetreatDate()}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Retreat Location
              </h3>
              <p className="text-sm flex items-center">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                {getRetreatLocation()}
              </p>
            </div>

            {getUserAddress() && (
              <div className="space-y-1 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Address
                </h3>
                <p className="text-sm flex items-start">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  {getUserAddress()}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Meditation Experience
              </h3>
              <p className="text-sm flex items-center">
                <HeartPulse className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="capitalize">
                  {registration.MeditationExperience}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Accommodation Type
              </h3>
              <p className="text-sm flex items-center">
                <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="capitalize">
                  {registration.accommodationType}
                </span>
              </p>
            </div>

            {registration.dietaryRestriction && (
              <div className="space-y-1 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Dietary Restrictions
                </h3>
                <p className="text-sm flex items-start">
                  <Utensils className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  {registration.dietaryRestriction}
                </p>
              </div>
            )}

            {registration.specialRequest && (
              <div className="space-y-1 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Special Requests
                </h3>
                <p className="text-sm flex items-start">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  {registration.specialRequest}
                </p>
              </div>
            )}
          </div>

          {children}

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Name
                </h3>
                <p className="text-sm flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {registration.emergencyContactName}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Phone
                </h3>
                <p className="text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  {registration.emergencyContactNumber}
                </p>
              </div>
            </div>
          </div>

          {registration.createdAt && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Registration Date:{" "}
              {format(
                new Date(registration.createdAt),
                "MMMM d, yyyy 'at' h:mm a"
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

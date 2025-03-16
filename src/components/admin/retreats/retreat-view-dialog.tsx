"use client";

import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IRetreat } from "@/types";

interface RetreatViewDialogProps {
  retreat: IRetreat;
  open: boolean;
  onClose: () => void;
}

export default function RetreatViewDialog({
  retreat,
  open,
  onClose,
}: RetreatViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{retreat.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {retreat.type}
              </Badge>
              {retreat.isVisible ? (
                <Badge variant="default" className="bg-green-600">
                  Published
                </Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>
            <p className="text-sm">{retreat.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Date
              </h3>
              <p className="text-sm flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                {format(new Date(retreat.date), "MMMM d, yyyy")}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Duration
              </h3>
              <p className="text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {retreat.duration}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Location
              </h3>
              <p className="text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {retreat.location}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Participants
              </h3>
              <p className="text-sm flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                {retreat.participants}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Price
              </h3>
              <p className="text-sm flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                {retreat.price}
              </p>
            </div>
          </div>

          {retreat.schedule && retreat.schedule.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Schedule
              </h3>
              <div className="border rounded-md divide-y">
                {retreat.schedule.map((item, index) => (
                  <div key={index} className="flex p-3">
                    <div className="w-24 font-medium">{item.time}</div>
                    <div>{item.activity}</div>
                  </div>
                ))}
              </div>
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

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  LinkIcon,
  Copy,
  Check,
  PhoneIcon as WhatsApp,
} from "lucide-react";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export function ShareDialog({ open, onClose, title, url }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this event: ${title}`);
    const body = encodeURIComponent(
      `I thought you might be interested in this event: ${title}\n\n${url}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
    onClose();
  };

  const shareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    );
    onClose();
  };

  const shareViaTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out this event: ${title}`
      )}&url=${encodeURIComponent(url)}`
    );
    onClose();
  };

  const shareViaLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`
    );
    onClose();
  };

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Check out this event: ${title} ${url}`
      )}`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
          <DialogDescription>
            Share this event with friends and colleagues
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input value={url} readOnly className="w-full" />
          </div>
          <Button
            type="button"
            size="icon"
            onClick={handleCopyLink}
            variant="outline"
            className="px-3"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Share via</h3>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
              onClick={shareViaEmail}
            >
              <Mail className="h-5 w-5 mb-1 text-gray-600" />
              <span className="text-xs">Email</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
              onClick={shareViaFacebook}
            >
              <Facebook className="h-5 w-5 mb-1 text-blue-600" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
              onClick={shareViaTwitter}
            >
              <Twitter className="h-5 w-5 mb-1 text-sky-500" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
              onClick={shareViaLinkedIn}
            >
              <Linkedin className="h-5 w-5 mb-1 text-blue-700" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            <Button
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
              onClick={shareViaWhatsApp}
            >
              <WhatsApp className="h-5 w-5 mb-1 text-green-500" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
              onClick={handleCopyLink}
            >
              <LinkIcon className="h-5 w-5 mb-1 text-gray-600" />
              <span className="text-xs">Copy Link</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import type { ToastAction } from "@/components/ui/toast";
// This file is based on shadcn/ui toast component
// https://ui.shadcn.com/docs/components/toast

import type * as React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast-hook";

export type ToastActionProps = React.ComponentPropsWithoutRef<
  typeof ToastAction
>;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export { ToastAction, type ToastProps } from "@/components/ui/toast";
export { useToast, toast } from "@/components/ui/use-toast-hook";

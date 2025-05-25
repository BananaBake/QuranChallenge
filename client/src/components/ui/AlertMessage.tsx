import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
export interface AlertMessageProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  onClose?: () => void;
}
interface AlertMessageContainerProps {
  messages: (AlertMessageProps & { id: string })[];
  onDismiss: (id: string) => void;
}
export function useAlertMessage() {
  const [messages, setMessages] = useState<(AlertMessageProps & { id: string })[]>([]);
  const showMessage = (props: AlertMessageProps) => {
    const id = Date.now().toString();
    const newMessage = { ...props, id };
    setMessages(prev => [...prev, newMessage]);
    if (props.duration !== 0) {
      const duration = props.duration || 5000;
      setTimeout(() => {
        dismissMessage(id);
      }, duration);
    }
    return id;
  };
  const dismissMessage = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };
  return {
    messages,
    showMessage,
    dismissMessage
  };
}
export function AlertMessage({ title, description, variant = "default", onClose }: AlertMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "relative flex w-full items-center justify-between overflow-hidden rounded-lg border p-4 pr-8 shadow-lg",
        variant === "destructive" && "border-red-500 bg-red-50 text-red-800",
        variant === "success" && "border-green-500 bg-green-50 text-green-800",
        variant === "default" && "border-primary/20 bg-primary/5 text-primary-foreground"
      )}
    >
      <div className="flex items-start gap-3">
        {variant === "destructive" && <AlertCircle className="h-5 w-5 text-red-600" />}
        {variant === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
        {variant === "default" && <CheckCircle className="h-5 w-5 text-primary" />}
        <div className="grid gap-1">
          {title && <div className="text-sm font-bold">{title}</div>}
          {description && <div className="text-sm">{description}</div>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "absolute right-2 top-2 rounded-md p-1 transition-opacity hover:opacity-100",
            variant === "destructive" ? "text-red-700 hover:bg-red-100" : 
            variant === "success" ? "text-green-700 hover:bg-green-100" :
            "text-primary/70 hover:bg-primary/10"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}
export function AlertMessagesContainer({ messages, onDismiss }: AlertMessageContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-3 p-4 md:max-w-[420px]">
      <AnimatePresence>
        {messages.map((message) => (
          <AlertMessage
            key={message.id}
            title={message.title}
            description={message.description}
            variant={message.variant}
            onClose={() => onDismiss(message.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
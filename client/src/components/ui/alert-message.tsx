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
        "relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg",
        variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
        variant === "success" && "border-green-400 bg-green-100 text-green-800"
      )}
    >
      <div className="flex items-start gap-3">
        {variant === "destructive" && <AlertCircle className="h-5 w-5" />}
        {variant === "success" && <CheckCircle className="h-5 w-5" />}
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100",
            variant === "destructive" ? "text-destructive-foreground" : "text-foreground"
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
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
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
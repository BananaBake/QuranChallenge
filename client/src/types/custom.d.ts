// client/src/types/custom.d.ts
declare global {
  interface AlertMessageProps {
    title?: string;
    description?: string;
    variant?: "default" | "destructive" | "success";
    duration?: number; // Duration in ms, 0 for indefinite
    // id is assigned internally by the showMessage function, so not part of input props
  }

  interface Window {
    showAlertMessage?: (props: AlertMessageProps) => string; // Returns the id of the message
  }
}

// This export is necessary to make this file a module, which is required for 'declare global'.
// It doesn't actually export anything, but it satisfies TypeScript's module requirement.
export {};
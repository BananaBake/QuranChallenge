import { AlertMessageProps } from '@/components/ui/alert-message';
declare global {
  interface Window {
    showAlertMessage?: (props: AlertMessageProps) => string;
  }
}
import { useNotificationSource } from "@/src/hooks/useSSENotifications";
import { ReactNode } from "react";
import ToastNotify from "../components/ToastNotify";

interface AuctionsLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<AuctionsLayoutProps> = ({
  children,
}) => {
  const notification = useNotificationSource();

  return (
    <>
      <div className="px-6 pb-6 flex flex-col justify-center">{children}</div>
      {notification && <ToastNotify notifyMessage={notification} />}
    </>
  );
};

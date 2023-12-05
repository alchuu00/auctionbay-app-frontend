import { useNotificationSource } from "@/src/hooks/useNotificationSource";
import { ReactNode } from "react";
import ToastSuccess from "../components/ToastSuccess";

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
      {notification && <ToastSuccess successMessage={notification} />}
    </>
  );
};

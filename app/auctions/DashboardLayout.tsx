import { ReactNode } from "react";

interface AuctionsLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<AuctionsLayoutProps> = ({
  children,
}) => {
  return <div className="px-6 w-screen flex flex-col justify-center">{children}</div>;
};

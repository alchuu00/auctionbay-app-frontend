import { ReactNode } from "react";

interface AuctionsLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<AuctionsLayoutProps> = ({
  children,
}) => {
  return (
    <div className="px-6 pb-6 flex flex-col justify-center">
      {children}
    </div>
  );
};

import { ReactNode } from "react";

interface AuctionsLayoutProps {
  children: ReactNode;
}

// TODO add Topbar component

export const AuctionsLayout: React.FC<AuctionsLayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

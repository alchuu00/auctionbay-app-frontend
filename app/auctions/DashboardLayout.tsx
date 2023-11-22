import { ReactNode } from "react";

interface AuctionsLayoutProps {
  children: ReactNode;
}

export const AuctionsLayout: React.FC<AuctionsLayoutProps> = ({ children }) => {
  return (
    <div>
      {/* Your main layout here */}
      {children}
    </div>
  );
};

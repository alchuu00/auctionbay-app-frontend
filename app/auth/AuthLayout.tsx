import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
      <div className="flex justify-between items-center h-screen">
        {children}
      </div>
  );
};

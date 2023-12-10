import { NotificationType } from "@/src/models/notification";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  notifyMessage: NotificationType;
}

const ToastNotify = ({ notifyMessage }: Props) => {
  const [showToast, setShowToast] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (notifyMessage) {
      setShowToast(true);
      timeoutId.current = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [notifyMessage]);

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    showToast && (
      <div
        id="toast-success"
        className="flex fixed bottom-5 left-5 items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
        role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-yellow-500 bg-orange-100 rounded-lg dark:bg-yellow-700 dark:text-orange-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
            />
          </svg>

          <span className="sr-only">Warning icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">{notifyMessage.message}</div>
        <button
          onClick={handleCloseToast}
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus-ring-2 focus-ring-gray-300 p-1.5 hover-bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark-text-gray-500 dark-hover-text-white dark-bg-gray-800 dark-hover-bg-gray-700"
          data-dismiss-target="#toast-warning"
          aria-label="Close">
          <span className="sr-only">Close</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    )
  );
};

export default ToastNotify;

import React from "react";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-fluoro-yellow" />
    </div>
  );
};

export default Loading;

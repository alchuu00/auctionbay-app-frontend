import React from "react";
import Image from "next/image";

const AuthHero = () => {
  return (
      <div className="flex justify-center items-center w-2/3">
        <Image
          src="/registerImg.png"
          alt="Hero Image"
          width={500}
          height={500}
        />
      </div>
  );
};

export default AuthHero;

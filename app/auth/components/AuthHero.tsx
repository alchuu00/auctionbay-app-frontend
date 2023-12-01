import React from "react";
import Image from "next/image";

const AuthHero = () => {
  return (
      <div className="lg:flex justify-center items-center lg:w-2/3 hidden">
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

import Link from "next/link";
import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        ></Image>
      </Link>
    </div>
  );
};

export default Logo;

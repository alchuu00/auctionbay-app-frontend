import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
import { userStorage } from "@/src/stores/userStorage";

const Logo: FC = () => {
  const user = userStorage.getUser();

  return (
    <div className="hidden lg:block">
      <Link href={user ? "/auctions/all" : "/"}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"></Image>
      </Link>
    </div>
  );
};

export default Logo;

import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
import { UserType } from "../models/auth";

interface Props {
  user: UserType | null;
}

const Logo: FC<Props> = ({user}) => {
  return (
    <div>
      <Link href={user ? '/dashboard' : '/'}>
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

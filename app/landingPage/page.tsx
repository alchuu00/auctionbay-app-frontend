import React from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex flex-col justify-between items-center h-screen">
      <Navbar></Navbar>
      <div className="flex flex-col gap-2 justify-end items-center mt-5">
        <h1 className="text-5xl font-bold">E-auctions made easy!</h1>
        <p className="font-light text-sm text-center">
          Simple way for selling your unused products, or<br/>getting a
          deal on product you want!
        </p>
        <Link href="/login" className="bg-fluoro-yellow text-sm font-medium px-4 py-2 rounded-2xl">
          Start bidding
        </Link>
      </div>

      <Image
        src="/landingPageImg.png"
        width={600}
        height={600}
        alt="Hero Image"
      ></Image>
    </div>
  );
};

export default LandingPage;

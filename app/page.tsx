import Link from "next/link";
import Navbar from "./components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col justify-between items-center h-screen">
      <div className="flex flex-col justify-between items-center h-screen">
        <Navbar />
        <div className="flex flex-col gap-2 justify-end items-center text-center mt-5">
          <h1 className="lg:text-6xl text-5xl font-bold">E-auctions made easy!</h1>
          <p className="font-light lg:text-md text-center">
            Simple way for selling your unused products, or
            <br />
            getting a deal on product you want!
          </p>
          <Link
            href="/auth/login"
            className="bg-fluoro-yellow text-md font-medium px-4 py-2 rounded-2xl">
            Start bidding
          </Link>
        </div>
        <Image
          src="/landingPageImg-mobile.png"
          width={800}
          height={800}
          alt="Hero Image"
          className="lg:hidden h-2/5 object-contain"
        />
        <Image
          src="/landingPageImg.png"
          width={800}
          height={800}
          alt="Hero Image"
          className="lg:block hidden"
        />
      </div>
    </main>
  );
}

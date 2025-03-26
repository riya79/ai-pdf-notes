"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-300">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md bg-white">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={150} height={50} />
        </Link>
        <div className="flex gap-6">
          <Link href="/features" className="text-gray-700 hover:text-black text-lg">Features</Link>
          <Link href="/solutions" className="text-gray-700 hover:text-black text-lg">Solutions</Link>
          <Link href="/testimonials" className="text-gray-700 hover:text-black text-lg">Testimonials</Link>
          <Link href="/blogs" className="text-gray-700 hover:text-black text-lg">Blogs</Link>
          <Link href="/dashboard/upgrade" className="text-gray-700 hover:text-black text-lg">Pricing</Link>
          {user ? (
            <UserButton />
          ) : (
            <Link href="/sign-in" className="text-white bg-blue-600 px-5 py-2 rounded-md text-lg hover:bg-green-700">Login</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center flex-grow px-5 py-32 bg-gradient-to-r from-purple-500 to-blue-600 text-white h-screen">
        <h1 className="text-6xl font-extrabold mb-6">AI-Powered <span className="text-red-600">PDF</span> <span className="text-blue-400">Note</span>-Taking</h1>
        <p className="max-w-3xl text-xl mb-8">
          Upload PDFs, annotate, and organize notes effortlessly. Let AI generate smart insights and summaries to boost your productivity.
        </p>
        <div className="flex gap-3">
        <Link href="/dashboard">
          <Button className="px-8 py-4 text-xl bg-black text-white hover:bg-gray-200 hover:text-black rounded-xl">Get Started</Button>
        </Link>
        
        <Link href="/dashboard">
          <Button className="px-8 py-4 text-xl bg-slate-400 text-white hover:bg-gray-400 rounded-xl">Learn more</Button>
        </Link>
        </div>
        
      </section>

      {/* Additional Content Section */}
      <section className="py-20 px-5 text-center">
        <h2 className="text-4xl font-bold mb-8">Why Choose Our App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-8 bg-white shadow-lg rounded-xl">
            <h3 className="text-2xl font-semibold">Seamless PDF Upload</h3>
            <p className="text-gray-700 mt-3 text-lg">Quickly upload and organize your PDFs with a smooth drag-and-drop interface.</p>
          </div>
          <div className="p-8 bg-white shadow-lg rounded-xl">
            <h3 className="text-2xl font-semibold">AI-Powered Summaries</h3>
            <p className="text-gray-700 mt-3 text-lg">Our advanced AI extracts key insights and creates intelligent summaries for easy reference.</p>
          </div>
          <div className="p-8 bg-white shadow-lg rounded-xl">
            <h3 className="text-2xl font-semibold">Secure Cloud Storage</h3>
            <p className="text-gray-700 mt-3 text-lg">Access your notes anytime, anywhere with encrypted and secure cloud storage.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

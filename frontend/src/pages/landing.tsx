'use client';
import React from 'react';
import LandingLayout from '@/components/LandingLayout';
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function LandingPage() {
  return (
    <LandingLayout>
      <div className="flex flex-col min-h-screen">
        <header className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-semibold text-green-800">GreenZone Analytics</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-gray-700 hover:text-green-800">About</Link>
              <Link href="/insights" className="text-gray-700 hover:text-green-800">Insights</Link>
              <Link href="/methodologies" className="text-gray-700 hover:text-green-800">Methodologies</Link>
              <button className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-md text-sm font-medium">Log in</button>
              <div className="flex items-center gap-1 text-gray-700">
                <span>EN</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <section className="bg-gray-50 py-12 md:py-20">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Visualizing Mongolian rangeland health</h2>
                <p className="text-gray-600">random text insert here.</p>
                <button className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-md text-sm font-medium">Launch Platform</button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Image
                  src="/mountain.png"
                  alt="mongolia map visualization"
                  width={400}
                  height={300}
                  className="w-full rounded-md border"
                />
              </div>
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-semibold text-center mb-12">A product for...</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {["Herders", "Risk Analysts", "Policymakers"].map((role) => (
                  <div key={role} className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{role}</h3>
                    <p className="text-gray-600">random text insert here.</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">About Us</h2>
                <p className="text-gray-600">random text insert here.</p>
                <button className="border border-green-800 text-green-800 hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium">learn more</button>
              </div>
              <Image src="/mountain.png" alt="Mongolian landscape" width={500} height={300} className="rounded-lg w-full" />
            </div>
          </section>

          <section className="py-16 bg-green-800 text-white">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
              <Image src="/mountain.png" alt="Mountain landscape" width={500} height={300} className="rounded-lg w-full" />
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Data &quot;at a glance&quot;</h2>
                <p className="text-gray-100">random text insert here.</p>
                <button className="border border-white text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium">learn more</button>
              </div>
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Our Methodologies</h2>
                <p className="text-gray-600">random text insert here.</p>
                <button className="border border-green-800 text-green-800 hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium">learn more</button>
              </div>
              <Image src="/mountain.png" alt="Mongolian herders" width={500} height={300} className="rounded-lg w-full" />
            </div>
          </section>
        </main>

        <footer className="bg-gray-700 text-white py-12">
          <div className="container mx-auto px-4">
          </div>
        </footer>
      </div>
    </LandingLayout>
  );
}
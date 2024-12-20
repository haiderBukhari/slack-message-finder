'use client'

import Head from "next/head";
import Hero from "../components/ui/Hero";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="robots" content="index" />
      </Head>
      <Hero />
    </>
  );
}

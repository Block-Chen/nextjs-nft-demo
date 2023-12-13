"use client";
import Link from "next/link";
import Header from "@/app/components/header";
import React from "react";

export default function Home() {
  return (
      <body>
          <div>
              <Header />
              <h1>페이지 리스트</h1>
              <li><Link href={{pathname: '/nft/list',}}>전체 NFT 리스트</Link></li>
              <li><Link href={{pathname: '/nft/create',}}>NFT 생성</Link></li>
          </div>
      </body>
  )
}

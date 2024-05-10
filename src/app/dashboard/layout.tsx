'use client'

import React from "react";
import Link from "next/link";
import "@/styles/dashboard.css";
import { Protect, useUser } from "@clerk/nextjs";
import PageNotFoundError from "@/components/404";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useUser();

  const role = user?.organizationMemberships.map(e => e.role) ?? [];
  const admin = role[0] === "org:admin";

  return (
    <Protect
      condition={() => admin}
      fallback={<PageNotFoundError />}>
        
        <section className="dashboard">
          <aside>
            <nav className="pr-5">
              <Link href="/dashboard">Update Sandwich</Link>
              <Link href="/dashboard/post-sandwich">Post Sandwich</Link>
              <Link href="/dashboard/delete-sandwich">Delete Sandwich</Link>
              <Link href="/dashboard/getSandwichById">Get sandwich by ID</Link>
              <Link href="/dashboard/users">Users</Link>
            </nav>
          </aside>

          {children}
        </section >
    </ Protect>
      );
}
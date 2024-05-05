'use client'

import { Protect, UserButton, useUser, useAuth } from "@clerk/nextjs"
import Link from "next/link"

export default function Header() {
  const { userId } = useAuth();
  const { user } = useUser();

  const role = user?.organizationMemberships.map(e => e.role) ?? [];
  const admin = role[0] === "org:admin";

  return (
    <>
      <div>
        <Link
          className="text-2xl"
          id="logo"
          href='/'
        >
          Logo
        </Link>
      </div>

      <nav>
        <ul className="flex items-center gap-10">

          <Link href='/'>Home</Link>

          {!userId ? (
            <>
              <Link href='sign-in'>Sign in</Link>
              <Link href='sign-up'>Sign up</Link>
            </>
          ) : (
            <>
              <Protect
                condition={() => admin}                
              >
                <Link href='/dashboard' >Dashboard</Link>
                {/* <Link href='/delete-sandwich' >Delete-Sandwich</Link> */}
                {/* <Link href='/update-sandwich' >Update-Sandwich</Link> */}
              </Protect>
              <UserButton afterSignOutUrl="/sign-in" />
            </>
          )}
        </ul>
      </nav>
    </>
  )
}

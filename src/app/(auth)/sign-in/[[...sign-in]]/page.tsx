import React from "react"
import { SignIn } from "@clerk/nextjs"

export async function generateStaticParams() {
  return [
    { signIn: [] }
  ];
}

export default function signIn() {
  return (
    <section className="form">
      <aside>
        <SignIn />
      </aside>
    </section>
  )
}

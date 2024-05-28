import React from "react"
import { SignIn } from "@clerk/nextjs"

export async function getStaticPaths() {
  return {
    paths: [
      { params: { 'sign-in': [] } },
    ],
    fallback: false
  };
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

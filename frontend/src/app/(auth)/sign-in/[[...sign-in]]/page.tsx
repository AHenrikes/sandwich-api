import React from "react"
import { SignIn } from "@clerk/nextjs"

export default function signIn() {
  return (
    <section className="form">
      <aside>
        <SignIn />
      </aside>
    </section>
  )
}

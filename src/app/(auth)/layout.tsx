import React from "react";
import "./login.css";

export async function generateStaticParams() {
  return [
    { signIn: [] },
    { signUp: [] }
  ];
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
    </>
  );
}

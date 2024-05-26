import React from 'react';
import { SignUp } from '@clerk/nextjs';

// Define generateStaticParams if you're using dynamic routing and SSG
export async function generateStaticParams() {
  return [
    { signUp: [] }
  ];
}

export default function signUp() {
  return (
    <section className='form'>
      <aside>
        <SignUp />
      </aside>
    </section>
  )
}

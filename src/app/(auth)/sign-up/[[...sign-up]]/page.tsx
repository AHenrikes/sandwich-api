import React from 'react';
import { SignUp } from '@clerk/nextjs';

export async function generateStaticParams() {
  return [
    { signUp: [] },
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

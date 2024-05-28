import React from 'react';
import { SignUp } from '@clerk/nextjs';

export async function getStaticPaths() {
  return {
    paths: [
      { params: { 'sign-up': [] } },
    ],
    fallback: false
  };
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

import React from 'react';
import { SignUp } from '@clerk/nextjs';

export default function signUp() {
  return (
    <section className='form'>
      <aside>
        <SignUp />
      </aside>
    </section>
  )
}
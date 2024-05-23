import React from 'react'
import Image from 'next/image';
import { clerkClient } from '@clerk/nextjs/server';

export default async function Users() {

  const users = await clerkClient.users.getUserList();

  return (
    <section className='Users flex gap-5'>
      {users.data.map(user => (
        <div key={user.id}>
          <h2>{user.firstName}</h2>
          <h2>{user.username}</h2>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image src={user.imageUrl} alt="none" width={150} height={150}/>
          
          <p>{user.id}</p>
          <code>{user.emailAddresses[0] ? user.emailAddresses[0].emailAddress : ''}</code>
        </div>
      ))}
    </section>
  )
}
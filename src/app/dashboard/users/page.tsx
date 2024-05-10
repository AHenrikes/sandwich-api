import React from 'react'
import { clerkClient } from '@clerk/nextjs'
import Image from 'next/image';

export default async function Users() {

  const users = await clerkClient.users.getUserList();

  return (
    <section className='Users'>
      {users.map(user => (
        <div key={user.id}>
          <h2>{user.firstName}</h2>
          <h2>{user.username}</h2>
          <img src={user.imageUrl} alt="none" />
          <p>{user.id}</p>
          <code>{user.emailAddresses[0] ? user.emailAddresses[0].emailAddress : ''}</code>
        </div>
      ))}
    </section>
  )
}
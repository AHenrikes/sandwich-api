# How to set up clerk:

1. Create a Clerk Account:
Visit the Clerk website and sign up for an account if you haven't already.

sign-up link to clerk: https://dashboard.clerk.com/sign-up
sign-in link to clerk: https://dashboard.clerk.com/sign-in

Once signed in, you'll have access to your Clerk dashboard where you can create and manage your projects.

2. Create a New Project:
Once logged in, navigate to your Clerk dashboard and click on the "New Project" button.
Give your project a name and follow the prompts to create it.
This will generate a Clerk API Key and Clerk Frontend API URL which you'll need to integrate Clerk into your project.
Copy and paste your API into .env.example

3. Create an admin user: (Optional)
If you want to see the admin side of the project. You will need to create an admin user.
Navigate to "Organizations Settings" in your Clerk dashboard and enable organizations. Once enabled you can navigate to "Organizations" under "Users" in your Clerk dashb>
In "Organizations" click "Create Organization". Give your organization any name and give it a Owner (if you don't have a user. you can simply create one in users tab).
Organization owners have admin rights and with it you can acces the admin side of the project.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

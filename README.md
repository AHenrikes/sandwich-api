## Project plan

Designing is done by brainstorming different approaches.

+ Frontend implementation
+ Dockerization of the frontend
+ MongoDB configuration
+ DB migration to PostgreSQL
+ API keys

+ Server A stub import
+ Dockerization of Server A
+ API implementation

+ Server B implementation
+ Dockerization of Server B

#### Architecture

The order path works as expected. User management has been implemented using Clerk. Clerk was set up to provide the functionalities that were originally in the API specification. Logins work and the admin panel is only available for admin users. Using Clerk for user management made handling the API keys a bit more complicated. A simple system was implemented for API keys that does not have automatic renewal of API keys. Some safety features have been implemented such as encrypting the API keys in the database and using parametrized queries, but some shortcuts have been made such as storing some sensitive data into the docker-compose, project code and environmental variables for easy deployment and testing.

+ Frontend
    + Next.js
    + modern
    + great documentation with clerk

+ Server A
    + node.js server stub
    + connect + swaggertools for routing
    + orchestrates communication with RabbitMQ
    + implements API

+ Server B
    + node.js
    + sets the order status as 
    + sends given msg after 10 seconds of waiting back to different queue

+ Message broker
    + RabbitMQ
    + Through acks we update order status to the DB (only on Server A side)
    + Order status goes to "received" on send, "inQueue" when being sent to msg q, "ready" or "failed" once after 10 s delay it arrives to Server A. 

+ Database
    + PostgreSQL
    + Increasing `id` field is very useful for this usecase
    + Using strict schema helps with this simple app
    + First tried MongoDB but id handling was a bit out of hand
    + Parametrized queries and API keys encrypted as safety features

+ User management & roles (admin & normal)
    + Clerk
    + works through the frontend (which makes our overall architecture hybrid instead of orchestration)
    + Simplifies user management
    + Looks great & modern
    + Configured lots to make it simple and work for our project
    + custom sign-in and sign-up pages 
    + Frontend security features: page protection and authentication

Overall system design pattern is not purely orchestration or choreography, but rather a hybrid solution in that Server-A and its API act as orcestration for everything else, but Clerk runs independently in a more of a choreography manner.

#### How to access system (different panels)

Log in using one of the test accounts:

+ admin
    + username : admin
    + password : admin
    
+ user
    + username : user
    + password : user

#### How to use the system

After logging in you can click on a sandwich and then click Send Order. You can see the orders with Get Orders or you can use Start polling button to check the orders every second. The chef takes 10 seconds for each sandwich and then a sandwich will be ready or failed.

There is a known bug that the frontend does not load correctly every time, possibly due to resource limitations of the machine that runs the docker containers. Manually refresh the page if you cannot see a round user element next to Home in the header.

If you click on the round user element in the header, you can manage your account or log out.

If you are logged in as admin, you can click Dashboard in the header. There you can update, post, delete and get sandwiches by id, and you can see the users.
The project is not friendly towards smaller devices.

#### How to try the system in your local enviroment

+ To start the project simply run `docker-compose up -d --build` in the root of the cloned repo.
+ Backend will start runing and frontend can be viewed in http://localhost:3000/.

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

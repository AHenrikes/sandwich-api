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
+ Instruction for setting up Clerk can be found in /frontend/README.md.

# TeamZero
This is an app that I am using to demo the power of Organizations in Auth0.

This app will require an Auth0 tenant with several configurations to run properly.

You will need a SPA, an M2M app connected to the Management API, 3 Organizations, and 3 Users to see all the capabilities.  You will need to create an `.env` file in the React app to configure the Auth0 SDK with your Auth0 domain, Auth0 client id, and your local express api base URL, and you will need the client id and client secret added into the `.env` file in the Express app that you get from generating the M2M app which will allow you to call the Auth0 Management API.

First user should be a member of all three orgs, second user should be a member of only one org, and the final user should not be a member of any of the orgs.

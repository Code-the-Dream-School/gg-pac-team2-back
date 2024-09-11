# Back-End Repo for Node/React Practicum

This will be the API for the front-end React app part of your practicum project.

These instructions are for the **front-end team** so they can setup their local development environment to run 
both the back-end server and their front-end app. You can go through these steps during your first group meeting 
in case you need assistance from your mentors.

>The back-end server will be running on port 8000. The front-end app will be running on port 3000. You will need to run both the back-end server and the front-end app at the same time to test your app.

### Setting up local development environment

1. Create a folder to contain both the front-end and back-end repos 
2. Clone this repository to that folder
3. Run `npm install` to install dependencies
4. Pull the latest version of the `main` branch (when needed)
5. Run `npm run dev` to start the development server
6. Open http://localhost:8000/api/v1/ with your browser to test.
7. Your back-end server is now running. You can now run the front-end app.

#### Running the back-end server in Visual Studio Code

Note: In the below example, the group's front-end repository was named `bb-practicum-team1-front` and the back-end repository was named `bb-practicum-team-1-back`. Your repository will have a different name, but the rest should look the same.
![vsc running](images/back-end-running-vsc.png)

#### Testing the back-end server API in the browser

![browser server](images/back-end-running-browser.png)

>Update the .node-version file to match the version of Node.js the **team** is using. This is used by Render.com to [deploy the app](https://render.com/docs/node-version).


### API Overview

This project provides a simple authentication API with two key endpoints:

### POST /api/v1/auth/register: 
Registers a new user and returns a JWT token.

##### Headers: 
Content-Type: application/json

##### Body:
{
   "parentName": "John Doe",
   "email": "johndoe@example.com",
   "password": "yourpassword"
}

### POST /api/v1/auth/login: 
Authenticates a user and returns a JWT token.

##### Headers: 
Content-Type: application/json
##### Body:
{
  "email": "johndoe@example.com",
  "password": "yourpassword"
}

Include the JWT token in the Authorization header as Bearer <token> for any protected routes. This API is essential for managing user authentication within the app.

###  /api/v1/profile:
#### Endpoint: GET '/allprofiles'
Retrieves a list of all user profiles (excluding passwords and tokens).

##### Headers:
Authorization: Bearer <token>

#### Endpoint: GET '/'
Retrieves the profile of the currently authenticated user.

##### Headers:
Authorization: Bearer <token>

#### Endpoint: PATCH '/'
Updates the profile of the currently authenticated user. Requires parentName and email in the request body.

##### Headers:
Authorization: Bearer <token>
Content-Type: application/json

##### Body:
{
   updatedData
}

#### Endpoint: GET '/:id'
Retrieves the profile of a user by their ID (excluding passwords and tokens).

##### Headers:
Authorization: Bearer <token>

#### Endpoint: DELETE '/:id'
Deletes the profile of a user by their ID. Only the profile owner can delete their own profile.

##### Headers:
Authorization: Bearer <token>

#### Endpoint: PATCH /api/v1/profile/:id/change-password
Allows authenticated users to change their password. Verifies the current password and updates it if valid. All active tokens are revoked upon a successful password change

##### Headers:
Authorization: Bearer <token>

##### Body:
{
   "currentPassword": "your current password",
   "newPassword": "new password"
}

#### Endpoint: POST /api/v1/auth/forgot-password
Handles password reset requests. Checks if the user exists by email, generates a password reset link with a token, and sends it to the user's email address. The token is valid for one hour.

##### Body:
{
   "email": "your registered email"
}

#### Endpoint: POST /api/v1/auth/reset-password/:id/:token
Allows users to reset their password using the reset token. The token is verified for validity and expiration before updating the password. All active tokens are revoked upon a successful password reset.

##### Params:
id (User ID) ,  token (Password reset token)

##### Body:
{
   "password": "new password"
}

#### Endpoint: POST /api/v1/auth/logout
Logs out the authenticated user by removing their token from the tokens array in the user's document.

##### Headers:
Authorization: Bearer <token>

#### Endpoint: POST /api/v1/requests
Allows authenticated users to create a new ride request specifying the profile, requested pickup days, and dropoff days.

##### Headers:
Authorization: Bearer <token>

##### Body:
{
   "profile": "profileId",
   "requestedDropOffDays": "Monday",
   "requestedPickUpDays": "Friday" 
}

#### Endpoint: POST /api/v1/requests/:id
Retrieves the details of a specific ride request. Accessible by both the requester and the profile owner.

##### Headers:
Authorization: Bearer <token>

#### Endpoint: GET /api/v1/requests/sent
Retrieves all ride requests that the authenticated user has sent.

##### Headers:
Authorization: Bearer <token>

#### Endpoint: GET /api/v1/requests/received
Retrieves all ride requests sent to the authenticated user.

##### Headers:
Authorization: Bearer <token>

#### Endpoint: PATCH /api/v1/requests/:id
Allows the requester to update the details of their ride request, such as pickup or dropoff days.

##### Headers:
Authorization: Bearer <token>

##### Body:
{
   "requestedDropOffDays": "Monday",
   "requestedPickUpDays": "Friday"
}

#### Endpoint: PATCH /api/v1/requests/:id/status
Allows the profile owner to update the status of a ride request, setting it to either approved or declined.

##### Headers:
Authorization: Bearer <token>

##### Body:
{
   "status": "approved"
}

#### Endpoint: DELETE /api/v1/requests/:id
Allows the requester to delete their ride request.

##### Headers:
Authorization: Bearer <token>

### User Schema

The User model is designed to store user information securely, including hashed passwords and JWT tokens.

##### Fields:

1. parentName (String): Required field for the parent's name.
2.  email (String): Required and unique email field with validation.
3.  password (String): Required field with a minimum length of 6 characters. Stored as a hashed value.
4.  tokens (Array): Stores JWT tokens associated with the user.
5.  childrenNames (Array): Optional field to store the names of children.
6.  numberOfSeatsInCar (Number): Optional field indicating available seats in the car.
7.  availableDropOffDays (Array): Enum field to store available drop-off days.
8.  availablePickUpDays (Array): Enum field to store available pick-up days.
9.  address (String): Optional field for the address.
10. phoneNumber (String): Optional field with validation for phone numbers.

### Middleware

Password Hashing: The password is automatically hashed before saving a user to the database.

JWT Token Generation: A method to generate and return a JWT token, storing it in the tokens array of the user.

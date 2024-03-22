

# Project API Documentation


## Overview
This document outlines the API endpoints available in the project and provides a guide for setting up and running the project.

The project is divided into two parts 
- frontend_app
- server
## Server

### API Endpoints

### User Registration
- Endpoint: `/api/users/v1/register`
- Method: POST
- Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }

Description: Register a new user.

### User Login
- Endpoint: /api/users/v1/login
- Method: POST
- Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Description: Authenticate a user and return a token and refresh.

### Get User Profile
- Endpoint: /api/users/v1/profile
- Method: GET
  
```json
Headers: Authorization: Bearer <TOKEN>
```
Description: Retrieve the profile of the authenticated user.

## Update User Profile
- Endpoint: /api/users/v1/profile
- Method: PUT
- MultipartBody
 
```json
Headers: Authorization: Bearer <TOKEN>

{
    "name": "Zahid",
    "email": "zahid@est.com",
    "avatar": "image file"
}
```
Description: Update the profile of the authenticated user change avatar ,name and email.



## Real-Time Notifications with Socket.io

This project uses Socket.io to send real-time notifications to users. To set up and use notifications:

1. Ensure Socket.io is installed both on the server and the client-side of your project.
2. for now server, emit events to connected clients when new user logs in or when they close the next.js app using `socket.emit('notification', { message: 'Your notification message' });`

3. On the client-side, listen for notifications with:
   ```javascript
   useEffect(() => {
     const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
       auth: {
         token: localStorage.getItem('token'), // Authentication token 
       },
     });

     socket.on('notification', (data) => {
       console.log('Notification received:', data.message);
       // Handle the notification
     });

     return () => socket.disconnect();
   }, []);


### Testing the API
Import the provided Postman collection to test the API endpoints.


### Setup and Running the Project
Prerequisites
Node.js
npm or yarn
MongoDB
```json
npm install
npm start
```
- ## FrontEnd App
  the frontend_app folder has the next.js froentend app that can be used to test the api endpoints 
  


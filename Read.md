

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
  


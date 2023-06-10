import express from "express";
import dotenv from "dotenv";
dotenv.config();

//coment out this port when u make .env file with config
// const port = 5000;

const port = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => res.send("Server is ready !"));

app.listen(port, () => console.log(`server started on port ${port}`));

// ALL ROUTES
// ***POST  /api/users  => Register a user
// ***POST  /api/users/auth  => Authenticat a user and get token
// ***POST  /api/users/logout  => Logout a user and clean cookie
// ***GET  /api/users/profile  => Get user profile
// ***PUT  /api/users/profile  => Update profile

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const connectDb = require("./config/dbConnection");

const port = 5000;

connectDb();
const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

app.use("/api/user", require("./routes/userRoutes")); // http://localhost:5000/api/user
app.use("/api/blog", require("./routes/blogRoutes")); // http://localhost:5000/api/user

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});
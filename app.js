require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// Database Connection
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// App Engine
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(methodOverride("_method"));

//Routes
app.get("/", (req, res) => {
    res.send("It Worked");
});

//Development Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Application started on port: http://localhost:${PORT}`);
});
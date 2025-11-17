const express = require("express");
const bodyParser = require("body-parser");
let users = [];

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/submit", (req, res) => {
     const { name, email, password} = req.body;

  
    if (!name || !email || !password) {
        return res.send("❌ All fields are required! <br> <a href='/'>Go back</a>");
    }

    const user = {name, email, password };
    users.push(user);

    res.render("result", { user, users });
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let users = [];

app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/submit", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send("❌ All fields are required! <br> <a href='/'>Go back</a>");
    }

    const newUser = {
        id: Date.now(),    
        name,
        email,
        password
    };

    users.push(newUser);

    res.render("result.ejs", { user: newUser, users });
});



app.get("/api/users", (req, res) => {
    res.json(users);
});

app.get("/api/users/:id", (req, res) => {
    const user = users.find(u => u.id == req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
});

app.post("/api/users", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.put("/api/users/:id", (req, res) => {
    const user = users.find(u => u.id == req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    res.json({ message: "User updated", user });
});

app.delete("/api/users/:id", (req, res) => {
    const index = users.findIndex(u => u.id == req.params.id);

    if (index === -1) return res.status(404).json({ message: "User not found" });

    users.splice(index, 1);
    res.json({ message: "User deleted" });
});

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});

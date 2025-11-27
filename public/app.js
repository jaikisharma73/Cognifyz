const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

let users = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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
    res.render("result", { user: newUser, users });
});

async function loadUsers() {
    try {
        const res = await fetch("/api/users");
        const users = await res.json();

        const list = document.getElementById("userList");
        list.innerHTML = "";

        if (users.length === 0) {
            list.innerHTML = "<li>No users found</li>";
            return;
        }

        users.forEach(user => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${user.name}</strong> — ${user.email}
            `;
            list.appendChild(li);
        });
    } catch (err) {
        console.log("Error:", err);
    }
}
window.onload = loadUsers;

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

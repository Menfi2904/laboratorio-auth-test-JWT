const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });
const app = express();
app.use(express.json());

const users = [
  { email: "admin@example.com", name: "admin", rol: "admin" },
  { email: "user@example.com", name: "user", rol: "user" },
];

const KEY = process.env.SECRET_KEY;

app.get("/", function (req, res) {
  res.send("Bienvenido a la api de ADA Cars");
});

app.post("/auth", (req, res) => {
  const { email } = req.body;
  const user = users.find((user) => user.email === email);
  if (user) {
    const token = jwt.sign(user, KEY);
    res.json({ token });
  } else {
    res.status(401).send({ error: "Invalid user name or password" });
  }
});

const JWTValidation = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Invalid token" });
  }

  jwt.verify(token, KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (decoded.rol === "admin" || decoded.rol === "user") {
      req.headers = { ...req.headers, rol: decoded.rol };
      next();
    } else {
      return res.status(403).json({ error: "Access not allowed" });
    }
  });
};

app.get("/premium-clients", JWTValidation, (req, res) => {
  res.send("premium-clients list");
});

app.get("/medium-clients", JWTValidation, (req, res) => {
  res.send("medium-clients list");
});

app.listen(3000, (req, res) => {
  console.log("servidor iniciando ...");
});

module.exports = app;

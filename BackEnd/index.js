const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const users = require("./users");

dotenv.config();

function parseUser(req, res, next) {
    tokenBearer -> user
    lay tu database -> user {roles}
}

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

app.use("/", users);

app.listen(3010);

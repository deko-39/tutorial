const express = require("express");

const adminRouter = express.Router();

function checkAdminToken(req, res, next) {
  const adminToken = req.headers["x-admin-token"];
  if (adminToken !== process.env.ADMIN_TOKEN) {
    res.status(401).send("No admin token found");
  }
  next();
}

function checkAdmin(req, res, next) {
  req.user.roles.include("admin");
  next();
}

adminRouter.post("/", checkAdminToken, async (req, res) => {
  userModel.create({ ...req.body, roles: ["admin"] });
  userModel.create({ ...req.body, roles: ["user"] });
});

adminRouter.get("/users", checkAdmin, async (req, res) => {});

const express = require("express");
const app = express();
const router = express.Router();
const userModel = require("./Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const cors = require("cors");
app.use(cors());
app.use(express.json());

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const user = await userModel.findOne({ username: username });
    if (!!user) {
      const passwordLogin = req.body.password;
      const passwordDB = user.password;
      const equalCompare = await bcrypt.compare(passwordLogin, passwordDB);
      if (equalCompare === true) {
        const token = jwt.sign(
          { id: user._id.toString(), username: user.username }, // payload
          process.env.ACCESS_TOKEN_SECRET, // secret key để tạo token
          {
            expiresIn: 10, //Exprire time of access token
          }
        );

        const refreshToken = jwt.sign(
          { id: user._id.toString(), username: user.username }, // payload
          process.env.ACCESS_TOKEN_SECRET, // secret key để tạo token
          {
            expiresIn: 1000, //Exprire time of refresh token
          }
        );
        // Save token -> dùng để refresh token
        user.accessToken = token;
        user.refreshToken = refreshToken;
        user.save();

        res.send({ accessToken: token, refreshToken: refreshToken });
      } else {
        res.status(401).send("Not Match password!");
      }
    } else {
      res.status(404).send("Not Found Your Account");
    }
  } catch (error) {
    console.log(error);
    res.send("Error!");
  }
});

router.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const user = await userModel.findOne({ username: username });
    if (!!user) {
      res.status(400).send("Da Co Tai Khoan");
    } else {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      await userModel.create({
        username: req.body.username,
        email: req.body.email,
        gender: req.body.gender,
        password: hashedPass,
      });
      res.status(200).send("Success");
    }
  } catch (error) {
    console.log(error);
    res.send("Error!");
  }
});

const checkToken = async (req, res, next) => {
  try {
    //Lay token tu header
    const accessToken = req.headers.authorization?.split(" ")[1];
    //Validate token -> parse payload
    const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    //Tim user co token
    const user = await userModel.findById(data.id).lean();
    if (!user) {
      res.status(401).send("No user found");
    }
    //Return user req.user
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("JWT error");
  }
};

router.get("/", checkToken, async (req, res) => {
  const users = await userModel.find({}).lean();
  res.status(200).send(users);
});

router.post("/logout", checkToken, async (req, res) => {
  //Xoa user.accessToken va user.refreshToken
  //refresh token có thời gian expire lớn hơn access token
});

router.post("/refresh-token", async (req, res) => {
  /// Lay access token va refresh token
  const { accessToken, refreshToken } = req.body;
  const user = await userModel.findOne({ accessToken, refreshToken });
  if (!user) {
    res.status(400).send("Can not find user");
  }

  const newAccessToken = jwt.sign(
    { id: user._id.toString(), username: user.username }, // payload
    process.env.ACCESS_TOKEN_SECRET, // secret key để tạo token
    {
      expiresIn: 10, //Exprire time of access token
    }
  );

  const newRefreshToken = jwt.sign(
    { id: user._id.toString(), username: user.username }, // payload
    process.env.ACCESS_TOKEN_SECRET, // secret key để tạo token
    {
      expiresIn: 1000, //Exprire time of refresh token
    }
  );
  // Save token -> dùng để refresh token
  user.accessToken = newAccessToken;
  user.refreshToken = newRefreshToken;
  user.save();

  res
    .status(200)
    .send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

module.exports = router;

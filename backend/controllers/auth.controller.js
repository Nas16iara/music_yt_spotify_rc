import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
export const signup = async (req, res) => {
  try {
    if (
      !req.body ||
      !req.body.username ||
      !req.body.password ||
      !req.body.name
    ) {
      console.log(req.body);
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }
    const { username, email, name } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Username or Email already in use" });
    }

    const newUser = new User({ username, email, name });

    await User.register(newUser, req.body.password);

    req.login(newUser, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, error: "Could not register user" });
      } else {
        res.status(200).json({ success: true, message: "User registered" });
      }
    });
  } catch (err) {
    console.error("Error in signup ", err);
    res.status(500).json({
      success: false,
      error: "Signup Unsuccessful",
    });
  }
};

export const login = async (req, res) => {
  try {
    if (!req.body || !req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ success: false, error: "Username and password is required" });
    }
    await passport.authenticate("local", (err, user) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, error: "Authentication Failed" });
      }
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "User not found" });
      }
      req.login(user, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, error: "Could not register user" });
        }
        const loggedUser = {
          username: user.username,
          name: user.name,
          email: user.email,
          _id: user._id,
        };
        return res.status(200).json({
          success: true,
          user: loggedUser,
        });
      });
    })(req, res);
  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("connect.sid");
    req.logout((err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error.message);
    res.status(500).json({ success: false, error: "Logout failed" });
  }
};

export const isAuth = (req, res) => {
  if (req.isAuthenticated()) {
    const user = {
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      _id: req.user._id,
    };
    res.status(200).json({ user: user });
  } else {
    res.status(401).json("Unauthorized");
  }
};

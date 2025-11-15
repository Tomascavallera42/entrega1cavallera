import { Router } from "express";
import passport from "passport";
import userModel from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;

  const exists = await userModel.findOne({ email });
  if (exists) return res.status(409).json({ status: "error" });

  const user = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
    role: role || "user"
  });

  const { password: _, ...clean } = user.toObject();
  res.json({ status: "success", payload: clean });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user) => {
    if (!user) return res.status(401).json({ status: "error" });

    const token = generateToken(user);
    const { password, ...clean } = user.toObject();

    res.json({ status: "success", payload: { token, user: clean } });
  })(req, res, next);
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ status: "success", payload: req.user });
  }
);

export default router;

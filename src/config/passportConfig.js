import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export default function configurePassport() {

  passport.use("login", new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) return done(null, false);
        const valid = user.isValidPassword(password);
        if (!valid) return done(null, false);
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  ));

  passport.use("jwt", new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.id).select("-password");
        if (!user) return done(null, false);
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  ));
}

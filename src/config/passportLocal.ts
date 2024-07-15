import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from "../db/prisma";
import { comparePassword } from "../service/bcrypt.service";
import { generateToken } from "../service/token.service";
import { AccountI } from "../interface/account.interface";

interface userSchema {
  fullname: string;
  email: string;
  phone?: string
  role: string;
  password?: string;
}


passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    console.log(username);
    
    const userFound = await prisma.account.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username },
            { phone: username }
          ]
        }
      });

    if (!userFound) {
      return done(null, false);
    }
    const isPasswordValid = userFound.password ? await comparePassword(password, userFound.password) : false;

    if (!isPasswordValid) {
      return done(null, false);
    }
    
    const userData = userFound as AccountI;
    const token = generateToken(userData);
    return done(null, { userFound: userFound, token });
  } catch (error) {
    return done(error);
  }
}))

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: userSchema, done) => done(null, user));
export default passport;
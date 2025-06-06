import Joi from "joi";
import { hash } from "bcryptjs";
import passport from "passport";
import prisma from "../utils/prisma.js";

async function login(req, res, next){
    if(req.method === "GET"){
        return res.json({ message: "Render login form" });
    }

    try {
        passport.authenticate("local", (err, user, info) => {
            if(err) return res.json({ message: "Server error"});

            if(!user) return res.json({ message: info?.message || "User not found"});

            req.logIn(user, err => {
                if(err) return res.json({ message: "Session error"});

                return res.json({ message: "User is connected !", user});
            });
        })(req, res, next);
    } catch (error) {
        return next(error);
    }
}

async function register(req, res, next){
    if(req.method === "GET"){
        return res.json({ message: "Render register form" });
    }
    
    try {
        const { name, email, password } = req.validatedBody;

        const existingUser = await prisma.user.findUnique({ where: { email }});
        if(existingUser) return res.json({ message: "Email already in use "});

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "regular"
            }
        });

        return res.json(user);
    } catch (error) {
        return next(error);
    }
}

async function logout(req, res, next){
    req.logout(err => {
        if(err){
            return next(err);
        }

        return res.json({ message: "User has been logout" });
    });
}

export {
    login,
    logout,
    register
}
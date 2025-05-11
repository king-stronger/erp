import prisma from "./prisma.js";
import { compare } from "bcryptjs";

async function strategy(email, password, done){
    try {
        const user = await prisma.user.findUnique({ where: { email }});

        if(!user) return done(null, false, { message: "User not found" });

        const matchedPassword = await compare(password, user.password);

        if(!matchedPassword) return done(null, false, { message: "Password doesn't match" });

        return done(null, user);
    } catch (error){
        return next(error);
    }
}

async function serialize(user, done){
    return done(null, user.id);
}

async function deserialize(id, done){
    try {
        const user = await prisma.user.findUnique({ where: { id }});

        if(!user) done();

        done(null, user);
    } catch (error){
        return next(error);
    }
}

export {
    strategy,
    serialize,
    deserialize
}
import path from 'path';
import express from 'express';
import passport from 'passport';
import pkg from 'passport-local';
import { fileURLToPath} from 'url';
import session from 'express-session';
import { 
    strategy,
    serialize,
    deserialize
} from './utils/passport.js';
import router from './routes/routes.js';
import errorHandler from './middlewares/errorHandler.js';

// Declare the constant variables
const PORT = process.env.PORT;
const LocalStrategy = pkg.Strategy;
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Init the express app
const app = express();

// Set middlewares to handle session and passport session
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Set middlewares to handle passport authentication
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, strategy));
passport.serializeUser(serialize)
passport.deserializeUser(deserialize);

// Set a middleware to handle static files
app.use(express.static(path.join(dirname, "public")));

// Set a middleware to handle form and json data
app.use(express.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(dirname, "views"));

// Use the router
app.use(router);

// Set middleware to handle page not found
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    return next(error);
});

// Handle global errors
app.use(errorHandler);

// Make the app listen on a specified port
app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
})
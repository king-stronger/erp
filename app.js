import path from 'path';
import express from 'express';
import passport from 'passport';
import pkg from 'passport-local';
import { fileURLToPath} from 'url';
import session from 'express-session';

// Declare the constant variables
const PORT = process.env.PORT;
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Init the express app
const app = express();

// Set a middleware to handle static files
app.use(express.static(path.join(dirname, "public")));

// Set a middleware to handle form and json data
app.use(express.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(dirname, "views"));

// Make the app listen on a specified port
app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
})
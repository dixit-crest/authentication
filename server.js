const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('passport');
const PORT = process.env.PORT || 3001;
const app = express();

const passportJWT = require("passport-jwt");
const { getUser } = require('./controllers/userControllers');
const CONSTANTS = require('./config/constants');
const notesRoutes = require('./routes/notesRoutes');
const projectRoutes = require('./routes/projectRoutes');
const shopsRoutes = require('./routes/shopRoutes');
require('dotenv').config();

app.use(express.json())

app.use('/api/users', userRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

const jwtOptions = {}
let ExtractJwt = passportJWT.ExtractJwt;

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = CONSTANTS.PASSWORD_HASH;

let steategy = new passportJWT.Strategy(
    jwtOptions,
    async (jwtPayload, next) => {
        // console.log("Payload recived ", jwtPayload);
        let user = await getUser(jwtPayload.id)

        if (user) {
            next(null, user)
        } else {
            next(null, false)
        }
    }
)
passport.use(steategy)

app.use(passport.initialize())


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
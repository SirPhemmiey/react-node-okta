require('dotenv').config({ path: '.env.local'});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('sequelize');
const epilogue = require('epilogue');
const OktaJwtVerify = require('@okta/jwt-verifier');

const oktaJwtVerify = new OktaJwtVerify({
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
    issue: `${process.env.REACT_APP_OKTA_ORG}/oauth2/default`
})

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
    try {
        if (!req.headers.authorization)
        throw new Error ("Authoration header is required");

        const accessToken = req.headers.authorization.trim(' ')[1];
        await oktaJwtVerify.verifyAccessToken(accessToken);
        next();
    } catch(error) {
        next(error.message)
    }
});

const database = new sequelize({
    dialect: 'sqlite',
    storage: './test.sqlite'
});

const Post = database.define('posts', {
    title: sequelize.STRING,
    body: sequelize.TEXT
});

epilogue.initialize({ app, sequelize: database});

epilogue.resource({
    model: Post,
    endpoints: ['/posts', '/posts/:id']
});

const port = process.env.SERVERT_PORT || 3001;

database.sync().then(() => {
    app.listen(port, () => {
        console.log(`Listening with 🔥 on port ${port}`);
    });
});


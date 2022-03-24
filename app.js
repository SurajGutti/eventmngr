const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const gqlSchema = require('./graphql/schema/index');
const gqlResolver = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const { graphqlHTTP } = require('express-graphql');
const {use} = require("express/lib/router");

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: gqlSchema,

    rootValue: gqlResolver,
    graphiql: true
}))

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.m3hkg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
    }).catch(err => {
        console.log(err);
});
const {API, Parameter, Route, Standardization} = require("../index");
const express = require("express");

// create api service
const aOSINT = new API(1, '/osint');

// common use parameter
pUsername = new Parameter('username', String);

pUsername.setMinMax(2, 40);
pUsername.setStandard(Standardization.standardizeUsername);

// route creation
const uCashApp = new Route('GET', 'cashapp');

uCashApp.setParameters([pUsername]);

uCashApp.setHandler((req, res) => {

    if (!pUsername.validate(req.query.username))
        res.send('invalid parameters');

})

aOSINT.addRoute(uCashApp);

// create an express app
const app = express();

// use the api
app.use(aOSINT.getPath(), aOSINT.getRouter());

// start the server
app.listen(3000, () => {
    console.log('server started');
});

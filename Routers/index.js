const routerCultura = require('./culturaRoute');
const routerUser = require('./userRoute');
const routerTask = require('./taskRoute');
const routerDespesa = require('./despesaRoute');


const express = require('express');
const app = express();

module.exports = (app, express) => {
    
    app.use(routerUser, routerCultura, routerTask, routerDespesa);
    }

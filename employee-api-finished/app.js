
const express = require('express');
var cors = require('cors');
var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

var app = express(); //creates  a new app object

app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cors())


//Swagger
//if (["production","staging"].indexOf(process.env.NODE_ENV) == -1) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
//}

//configure routes
app.use("/employees", require('./routes/employee-routes'));

// 404 error handler (client side error)
app.use((req, res, next) => {
    return res.status(404).json({
      error: "Not Found",
    });
  });

//configure error handlers (server side error)
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV == "development") {
        console.error(err.stack);
    }
    res.status(500).send({ 'error': 'Something broke!' })
});

module.exports = app;


var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors');
var routes = require("./routes/routes.js");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));

routes(app);

var server = app.listen(8080, function () {
    console.log("app running on port.", server.address().port);
});
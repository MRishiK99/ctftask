const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const expressValidator = require('express-validator') 
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');


const userRoutes = require('./routes/user_routes');
const adminRoutes = require('./routes/admin_routes');


const app = express();
dotenv.config();



const port = process.env.PORT;
app.use(expressValidator());
app.use(cors());
app.use(require("express-session")({
    secret: "This is the secret line",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, 'localhost', () =>{
    //app.listen(port, () =>{
        console.log(`Server runnning on port ${port}`);
    });
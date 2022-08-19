require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, { useNewUrlParser: true });
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'POC-mold-costing REST API',
            description: "A REST API built with Express and MongoDB.",
            version: "1.0.0"
        },
        license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
        },
        servers: [
            {
                url: "http://localhost:3000/api",
            },
        ],
        contact: {
            name: "thomas",
            email: "thomas.ngo@siemens.com"
        },
        host: `localhost:3000`,
        basePath: '/',
        produces: ['application/json'],
        schemes: [
            'http',
        ],
    },
    apis: ["./routes/*.js"]
}

app.use('/api', routes);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const options = {
    customSiteTitle: 'Data Service API',
    customCss: '.topbar { display: none }',
};
app.get('/api.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(swaggerDocs);
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Started at http://localhost:${3000}`)
})
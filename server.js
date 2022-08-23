require('dotenv').config();

const express = require('express');
const routes = require('./routes/routes');
const mcRoutes = require('./routes/mcRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const db = require('./mongoUtils');

db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
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
                url: "http://localhost:3000/moldcost"
            },
        ],
        host: `localhost:3000`,
        basePath: '/',
        produces: ['application/json'],
        schemes: [
            'http',
        ],
    },
    apis: ["./routes/mcRoutes.js"]
}

// app.use('/api', routes);
app.use('/moldcost', mcRoutes);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const options = {
    customSiteTitle: 'Data Service API',
    customCss: '.topbar { display: none }',
};

// app.get('/api.json', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json(swaggerDocs);
// });

app.get('/moldcost.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(swaggerDocs);
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Started at http://localhost:${3000}`)
})
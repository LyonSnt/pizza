const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

// INICIO AGREGADO EL 13-01-2020
const {importSchema} = require ('graphql-import');
const {makeExecutableSchema} = require ('graphql-tools');

// INICIO AGREGADO EL 13-01-2020


//const { db } = require("./conexionPGSQL"); // ESTAMOS IMPORTANDO LA CLASE CONEXION

const PORT = 3000;
const endPoint = '/pizza_api'
//const schema = null //COMENTADO EL 13-01-2020

let server = express();

// INICIO AGREGADO EL 13-01-2020
const typeDefs = importSchema('./schema.graphql')
//const resolvers = {}

import resolvers from './resolvers';

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

// FIN AGREGADO EL 13-01-2020


server.use(endPoint, bodyParser.json(), graphqlExpress ({
    schema
}));

server.use('/graphiql', graphiqlExpress ({
    endpointURL: endPoint,
}));

server.listen(PORT, () => {
    console.log('GraphQl API listen in http://localhost:' + PORT + endPoint);
    console.log('GraphiQl listen in http://localhost:' + PORT + '/graphiql');
});

console.log("Hola");
// holaansndsnmd  
//jdjdjj 
///
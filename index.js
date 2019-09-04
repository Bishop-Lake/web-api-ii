const express = require('express');

const postRoutes = require('./posts/postRoutes')

const server = express();

server.use(express.json())
server.use('/', postRoutes)


const port = 8000

server.listen(port, () => console.log(`\n Server listening on port ${port} \n`))
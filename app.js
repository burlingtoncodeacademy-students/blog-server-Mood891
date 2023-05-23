const express = require('express');
const routes = require('./controllers/routes.js');
require("dotenv").config()
const app = express();
let port = process.env.PORT
app.use(express.json())
// Use the routes as middleware
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

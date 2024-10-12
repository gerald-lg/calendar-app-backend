const path = require('path');

const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { dbConnection } = require('./database/config');



// EXPRESS SERVER
const app = express();

// DATA BASE
dbConnection();

// CORS
app.use(cors())

// PUBLIC DIRECTORY
app.use( express.static('public') );

// READ AND PARSE BODY DATA
app.use( express.json() );

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.use('*', (req, res) => {
    res.sendFile( path.join( __dirname, 'public/index.html') );
})

// LISTENING REQUEST
app.listen( process.env.PORT, () =>  {
    console.log(`Server start in port ${ process.env.PORT }`);
});



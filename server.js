// import express framework
const express = require('express');

// import mysql promise-based client
const mysql = require('mysql2/promise');

// load environment variables from .env file
require('dotenv').config();

// server will run on this port
const port = 3000;

// database configuration object
const dbConfig = {
    // database host (from .env)
    host: process.env.DB_HOST,

    // database username
    user: process.env.DB_USER,

    // database password
    password: process.env.DB_PASSWORD,

    // database name
    database: process.env.DB_NAME,

    // database port
    port: process.env.DB_PORT,

    // allow waiting if connections are busy
    waitForConnections : true,

    // maximum number of connections
    connectionLimit: 100,

    // unlimited queued connection requests
    queueLimit: 0,
};

// create express application
const app = express();

// allow app to read JSON request bodies
app.use(express.json());

// start server and listen on port 3000
app.listen(port, ()=>{
    console.log('Server running on port', port);
});


// route to get all pokemon from database
app.get('/allpokemon', async (req, res) => {
    try{
        // create database connection
        let connection = await mysql.createConnection(dbConfig);

        // execute SQL query to fetch all rows
        const [rows] = await connection.execute(
            'SELECT * FROM defaultdb.pokemon'
        );

        // send rows back as JSON
        res.json(rows);
    } catch (err){
        // log error to console
        console.log(err);

        // send server error response
        res.status(500).json({
            message: 'Server error for allpokemon'
        });
    }
});


// route to add a new pokemon
app.post('/addpokemon', async (req, res)=>{
    // extract data from request body
    const {pokemon_name, pokemon_type, pokemon_pic} = req.body;

    try{
        // create database connection
        let connection = await mysql.createConnection(dbConfig);

        // insert new pokemon into database
        await connection.execute(
            'INSERT INTO pokemon (pokemon_name, pokemon_type, pokemon_pic) VALUES (?,?,?)',
            [pokemon_name, pokemon_type, pokemon_pic]
        );

        // send success response
        res.status(201).json({
            message: 'Pokemon ' + pokemon_name + ' added successfully'
        });
    } catch(err){
        // log error
        console.log(err);

        // send error response
        res.status(500).json({
            message: 'Server error - could not find pokemon ' + pokemon_name
        });
    }
});

app.get('/deletepokemon/:idpokemon', async (req, res) => {
    const { idpokemon } = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM pokemon WHERE idpokemon = ?',
            [idpokemon]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Pokemon not found'
            });
        }

        res.json({
            message: 'Pokemon found for deletion',
            pokemon: rows[0]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Server error - could not fetch pokemon'
        });
    }
});
// route to delete a pokemon
app.delete('/deletepokemon/:idpokemon', async (req, res) => {
    const { idpokemon } = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'DELETE FROM pokemon WHERE idpokemon = ?',
            [idpokemon]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Pokemon not found'
            });
        }
        await connection.execute('ALTER TABLE pokemon AUTO_INCREMENT = 1');

        res.json({
            message: 'Pokemon deleted successfully'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Server error - could not delete pokemon'
        });
    }
});

// route to update an existing pokemon
app.put('/updatepokemon/:idpokemon', async (req, res) => {
    // extract updated data from request body
    const { idpokemon } = req.params;
    const { pokemon_name, pokemon_type, pokemon_pic } = req.body;

    try {
        // create database connection
        let connection = await mysql.createConnection(dbConfig);

        // update pokemon data based on id
        const [result] = await connection.execute(
            'UPDATE pokemon SET pokemon_type = ?, pokemon_pic = ?, pokemon_name = ? WHERE idpokemon = ?',
            [pokemon_type, pokemon_pic, pokemon_name, idpokemon]
        );

        // if no rows updated, pokemon doesn't exist
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Pokemon not found'
            });
        }

        // send success response
        res.json({
            message: 'Pokemon updated successfully'
        });
    } catch (err) {
        // log error
        console.log(err);

        // send server error
        res.status(500).json({
            message: 'Server error - could not update pokemon'
        });
    }
});
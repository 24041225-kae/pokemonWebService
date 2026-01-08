const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    //get these details from the env varaibles that set on host server
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections : true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialise express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start server
app.listen(port, ()=>{
    console.log('Server running on port', port);
});

//route: GET all poke
app.get('/allpokemon', async (req, res) => {
    try{
        let connection = await mysql.createConnection(dbConfig); //connects aiven database server
        const [rows] = await connection.execute('SELECT * FROM defaultdb.pokemon'); //executes mysql query to get rows from pokemon table
        res.json(rows); //displays retrieved data in JSON
    } catch (err){
        //displays if server got error
        console.log(err);
        res.status(500).json({message: 'Server error for allpokemon'});
    }
});

//route: create a new poke
app.post('/addpokemon', async (req, res)=>{
    const {pokemon_name, pokemon_type, pokemon_pic} = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO pokemon (pokemon_name, pokemon_type, pokemon_pic) VALUES (?,?,?)', [pokemon_name, pokemon_type, pokemon_pic]); //adds new row
        res.status(201).json({message: 'Pokemon ' +pokemon_name+' added successfully'}); //display msg
    } catch(err){
        console.log(err);
        res.status(500).json({message: 'Server error - could not find pokemon '+pokemon_name});
    }
});

app.delete('/deletepokemon', async (req, res)=>{
    const {pokemon_name} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'DELETE FROM pokemon WHERE pokemon_name = ?',
            [pokemon_name]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        res.json({ message: 'Pokemon deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error - could not delete pokemon' });
    }

});

app.put('/updatepokemon', async (req, res) => {
    const { pokemon_name, pokemon_type, pokemon_pic } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'UPDATE pokemon SET pokemon_type = ?, pokemon_pic = ? WHERE pokemon_name = ?',
            [pokemon_type, pokemon_pic, pokemon_name]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        res.json({ message: 'Pokemon updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error - could not update pokemon' });
    }
});
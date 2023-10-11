const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mysql-container',    
    user: 'root',         
    password: 'root',     
    database: 'mydb', 
    port: 3306
  });

  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
});


app.get('/brands', (req, res) => {
    const sqlQuery = 'SELECT distinct(marque) FROM modeles;';

    connection.query(sqlQuery, (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête : ' + err.stack);
          return res.status(500).json({ error: 'Erreur de base de données' });
        }
    
        res.json(results);
    });

});

app.get('/models/:marques', (req, res) => {
  const marque = req.params.marques;
  if (!marque) {
      return res.status(400).json({ error: 'Marque parameter is required' });
  }

  const sqlQuery = 'SELECT * FROM modeles WHERE marque = ?'; // Use a parameterized query

  connection.query(sqlQuery, [marque], (err, results) => {
      if (err) {
          console.error('Erreur lors de l\'exécution de la requête : ' + err.stack);
          return res.status(500).json({ error: 'Erreur de base de données' });
      }

      res.json(results);
  });
});



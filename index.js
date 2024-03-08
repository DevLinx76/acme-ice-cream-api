// Purpose: to create a server that will allow the user to interact with a database of ice cream flavors.
const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_flavors_db');
const app = express();

// Middleware
app.use(express.json());

// Logging
app.use(require('morgan')('dev'));

// Read Flavors - R
app.get('/api/flavors', async (req, res, next) => {
  try {
    const SQL = 'SELECT * from flavors ORDER BY created_at DESC;';
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

// Create Flavor - C
app.post('/api/flavors', async (req, res, next) => {
  try {
    const SQL = 'INSERT INTO flavors(name, s_favorite) VALUES($1, $2) RETURNING *';
    const response = await client.query(SQL, [req.body.name, req.body.s_favorite]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

// Update Flavor - U
app.put('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = 'UPDATE flavors SET name=$1, s_favorite=$2, updated_at=now() WHERE id=$3 RETURNING *';
    const response = await client.query(SQL, [req.body.name, req.body.s_favorite, req.params.id]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

// Delete a Flavor - D
app.delete('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = 'DELETE from flavors WHERE id=$1 RETURNING *';
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// Create and run the express app
const init = async () => {
  await client.connect();

  let SQL = `         
        DROP TABLE IF EXISTS flavors;

        CREATE TABLE flavors (            
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            s_favorite BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        );
    `
  await client.query(SQL);
  console.log('Flavors table created');

  // Seed data with initial flavors
  SQL = ` 
        INSERT INTO flavors(name, s_favorite) VALUES('Vanilla', true);
        INSERT INTO flavors(name, s_favorite) VALUES('Chocolate', false);
        INSERT INTO flavors(name, s_favorite) VALUES('Strawberry', true);
    `
  await client.query(SQL);
  console.log('Initial flavors data seeded');

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

init();

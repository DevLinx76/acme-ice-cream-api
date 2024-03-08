const express = require('express');
const { Pool } = require('pg');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/acme_ice_cream_shop_db',
});

// Function to initialize database and start server
const init = async () => {
  // Connect to the database
  await pool.connect();
  console.log('connected to database');

  // Create flavors table
  let SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      s_favorite BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(SQL);
  console.log('tables created');

  // Seed the table with initial flavors
  SQL = `
    INSERT INTO flavors (name, s_favorite) VALUES 
    ('Vanilla', true),
    ('Chocolate', false),
    ('Strawberry', false);
  `;
  await pool.query(SQL);
  console.log('data seeded');

  // Start listening on the port
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

app.get('/api/flavors', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM flavors;');
  res.send(rows);
});

app.get('/api/flavors/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM flavors WHERE id = $1;', [req.params.id]);
  if(rows.length === 0) {
    return res.status(404).send('Flavor not found');
  }
  res.send(rows[0]);
});

app.post('/api/flavors', async (req, res) => {
  const { name, s_favorite } = req.body;
  const { rows } = await pool.query('INSERT INTO flavors (name, s_favorite) VALUES ($1, $2) RETURNING *;', [name, s_favorite]);
  res.status(201).send(rows[0]);
});

app.delete('/api/flavors/:id', async (req, res) => {
  await pool.query('DELETE FROM flavors WHERE id = $1;', [req.params.id]);
  res.status(204).send();
});

app.put('/api/flavors/:id', async (req, res) => {
  const { name, s_favorite } = req.body;
  const { rows } = await pool.query('UPDATE flavors SET name = $1, s_favorite = $2, updated_at = NOW() WHERE id = $3 RETURNING *;', [name, s_favorite, req.params.id]);
  if(rows.length === 0) {
    return res.status(404).send('Flavor not found');
  }
  res.send(rows[0]);
});

// Invoke the init function to start the application
init();


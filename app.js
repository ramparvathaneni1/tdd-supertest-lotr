const express = require('express');
const app = express();
// const pg = require('pg');
// const client = new pg.Client({
// 	database:'supertest_lab'
// });

// imports the Pool object from the pg npm module, specifically
const Pool = require('pg').Pool 

// This creates a new connection to our database. Postgres listens on port 5432 by default
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'supertest_lab',
  password: 'postgres',
  port: 5432,
})

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

// Fetch People by Query Params
app.get('/people', async (req, res)=>{

  const baseQuery = "SELECT * FROM people WHERE 1 = 1";
  const olderThanValue = req.query.olderThan || "";
  const youngerThan = req.query.youngerThan || "";
  const ancestry = req.query.ancestry || "";
  const name = req.query.name || "";
  let fullQuery = baseQuery;

  console.log("req.query = ", req.query);

  // Age
  if (olderThanValue) {
    fullQuery += " AND age > " + olderThanValue;
  }
  if (youngerThan) {
    fullQuery += " AND age < " + youngerThan;
  }
  if (ancestry) {
    fullQuery += " AND ancestry ILIKE '%" + ancestry + "%'";
  }
  if (name) {
    fullQuery += " AND name ILIKE '%" + name + "%'";
  }

  console.log("Full Query = ", fullQuery);

	const result = await pool.query(fullQuery);
	res.json(result.rows);
});

// Creating Person in LOTR
app.post("/people", async (req, res)=>{
  console.log("Create Person Request body = ", req.body);
  const name = req.body.name;
  const age = parseInt(req.body.age);
  const ancestry = req.body.ancestry;
  const query = `INSERT INTO people (name, age, ancestry)
    VALUES ('${name}', ${age}, '${ancestry}')`;
  console.log("Insert Query = ", query);

  // Check if all fields are populated
  if (name && age > 0 && ancestry) {
    const result = await pool.query(query);
    console.log("Insert result = ", result);

    if (result.rowCount > 0) {
      res.status(200).json({success: true});
    } else {
      res.status(500).json({success: false});
    }
  } else {
    // Bad Request
    res.status(400).json({success: false});
  }
});

// Delete Person by name in LOTR
app.delete("/person", async(req, res) => {

});

// Update Person in LOTR
app.put("/person", async(req, res) => {

});

const PORT = process.env.PORT || 3000;
pool.connect(()=>{
	console.log('connected to postgres');
})
server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
module.exports = {app, server, pool} // this is so we can stop the server programmatically 


const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const redis = require('redis');

const app = express();
const port = 3078;

const bodyParser = require('body-parser');
const { serialize } = require('v8');

app.use(cors());
app.use(bodyParser.json());

const con = mysql.createConnection({
  host: 'localhost',
  user: 'user78',
  password: '78find',
  database: 'db78'
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

const redisclient = redis.createClient();

(async () => { 
  await redisclient.connect(); 
})(); 

redisclient.on("ready", () => {
  console.log("redis Connected!");
});

redisclient.on("error", (err) => {
  console.log("Error in the redis Connection");
});

app.post('/insertDataBase', async (req, res) => {
    const userData = req.body; // Extract user data from the request body

    const sql = 'INSERT INTO randuser (first, last) VALUES (?, ?)';
    const params = [userData.first, userData.last];

    con.query(sql, params, async (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data' });
      } else {
        // Data inserted successfully, now add it to the Redis cache
        try {

          await redisclient.set(userData.first, userData.last);

          res.json({ success: true });
        } catch (redisError) {
          console.error('Error adding data to Redis cache:', redisError);
          // Handle the error, you might want to log it or send an appropriate response
          res.status(500).json({ error: 'Error adding data to Redis cache' });
        }
      }
    });
  });


app.post('/flushRedisCache', async (req, res) => {
  try {
    await redisclient.flushAll();
    res.json({ message: 'Redis cache flushed successfully' });
  } catch (error) {
    console.error('Error flushing Redis cache:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/searchDataBase', async (req, res) => {
  const startTime = new Date();

  const searchTerm = req.query.search;
  const redisKey = searchTerm;

  try {
    const cachedLastName = await redisclient.get(redisKey);

    if (cachedLastName != null) {
      console.log('Data found in Redis cache');
      const response = [{
        first: redisKey,
        last: cachedLastName
      }];

      const endTime = new Date(); // End timer here
      const elapsedTime = endTime - startTime; // Calculate elapsed time

      const resultWithTime = { data: response, processingTime: elapsedTime };
      
      return res.json(resultWithTime);
    } else {
      console.log('Data not found in Redis cache - searching the database');
    }


    const sql = 'SELECT * FROM randuser WHERE first LIKE ?';
    const params = [`%${searchTerm}%`];

    con.query(sql, params, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const endTime = new Date(); // End timer here
      const elapsedTime = endTime - startTime; // Calculate elapsed time

      const resultWithTime = { data: result, processingTime: elapsedTime };

      res.json(resultWithTime);
    });
  } catch (redisError) {
    console.error('Error accessing Redis cache:', redisError);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/selectAllDataBase', async (req, res) => {
  const query = 'SELECT * FROM randuser';

  try {
    const startTime = new Date(); // Start timer here

    const cachedData = await redisclient.get(query);

    if (cachedData) {
      console.log('Data found in Redis cache');
      const endTime = new Date(); // End timer here
      const elapsedTime = endTime - startTime; // Calculate elapsed time
      const result = JSON.parse(cachedData);
      const resultWithTime = { data: result, processingTime: elapsedTime };
      return res.json(resultWithTime);
    } else {
      console.log('Data not found in Redis cache - grabbing data from the database');
    }

    if (!cachedData) {
      con.query(query, async (err, result, fields) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
          await redisclient.set(query, JSON.stringify(result));

          for (let i = 0; i < result.length; i++) {
            await redisclient.set(result[i].first, result[i].last);
          }

          const endTime = new Date(); // End timer here
          const elapsedTime = endTime - startTime; // Calculate elapsed time

          // Attach processingTime to the entire result
          const resultWithTime = { data: result, processingTime: elapsedTime };
          res.json(resultWithTime);
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    }
  } catch (redisError) {
    console.error('Error accessing Redis cache:', redisError);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


// ---------------------------------my sql----------------------------------------------


// const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors');
// const redis = require('redis');

// const app = express();
// const port = 3078;

// const bodyParser = require('body-parser'); // Add this line to handle JSON in the request body

// app.use(cors());
// app.use(bodyParser.json()); // Use bodyParser to parse JSON in the request body


// const con = mysql.createConnection({
//   host: 'localhost',
//   user: 'user78',
//   password: '78find',
//   database: 'db78'
// });

// con.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to MySQL database');
// });


// app.get('/selectAllDataBase', (req, res) => {
//   const query = 'SELECT * FROM randuser';
//   con.query(query, (err, result, fields) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     res.json(result);
//   });
// });

// app.delete('/deleteDataBase', (req, res) => {
//   const searchTerm = req.query.search;

//   const sql = 'DELETE FROM randuser WHERE first LIKE ?';
//   const params = [`%${searchTerm}%`];

//   con.query(sql, params, (err, result) => {
//       if (err) {
//           console.error('Error deleting data:', err);
//           res.status(500).json({ error: 'Error deleting data' });
//       } else {
//           console.log('Delete successful');
//           res.json({ success: true });
//       }
//   });
// });

// app.get('/searchDataBase', (req, res) => {
//   const searchTerm = req.query.search;
//   const sql = 'SELECT * FROM randuser WHERE first LIKE ?';
//   const params = [`%${searchTerm}%`];

//   con.query(sql, params, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     res.json(result);
//   });
// });

// // Add a new route to handle the POST request for inserting data
// app.post('/insertDataBase', (req, res) => {
//   const userData = req.body; // Extract user data from the request body

//   const sql = 'INSERT INTO randuser (first, last, country, age, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)';
//   const params = [userData.first, userData.last, userData.country, userData.age, userData.latitude, userData.longitude];

//   con.query(sql, params, (err, result) => {
//       if (err) {
//           console.error('Error inserting data:', err);
//           res.status(500).json({ error: 'Error inserting data' });
//       } else {
//           res.json({ success: true });
//       }
//   });
// });


// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });
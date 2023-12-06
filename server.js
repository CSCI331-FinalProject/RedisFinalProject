const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { exec } = require("child_process");
const app = express();
const port = 3078;
const redis = require('redis');

const dir = `${__dirname}\\public\\`
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));


//Server database
// const dbConfig = {
//     host: "localhost",
//     user: "user84",
//     password: "84adle",
//     database: "db84"
// };

const dbConfig = {
    host: "localhost",
    user: "user78",
    password: "78find",
    database: "db78"
};


const redisclient = redis.createClient(); 
  
(async () => { 
    await redisclient.connect(); 
})(); 
  
console.log("Connecting to the Redis"); 
  
redisclient.on("ready", () => { 
    console.log("Connected!"); 
}); 
  
redisclient.on("error", (err) => { 
    console.log("Error in the Connection"); 
}); 




const pool = mysql.createPool(dbConfig);
app.post('/submit', (req, res) => {
    // Access form data from the request body
    const { first, last, country, age, latitude, longitude } = req.body;

    // Use the connection pool to query the database
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting database connection:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Query to insert data into the database
        const sql = "INSERT INTO randuser (first, last, country, age, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [first, last, country, age, latitude, longitude];

        connection.query(sql, values, (queryErr, result) => {
            connection.release(); // Release the connection back to the pool

            if (queryErr) {
                console.error("Error executing database query:", queryErr);
                res.status(500).send("Internal Server Error");
                return;
            }           

            // Query to fetch data from the database
            const selectQuery = "SELECT first, last FROM randuser";
            const startTimeMySQL = performance.now();
            connection.query(selectQuery, (selectErr, selectResult) => {
                if (selectErr) {
                    console.error("Error executing select query:", selectErr);
                    res.status(500).send("Internal Server Error");
                    return;
                }
            
            // Stop measuring time for MySQL retrieval
            const endTimeMySQL = performance.now(); 
            const elapsedTimeMySQL = (endTimeMySQL - startTimeMySQL).toFixed(3);

		async function nodeRedis() {
 		try {
		for (let i = 0; i<selectResult.length; i++){
			await redisclient.set(selectResult[i].first, selectResult[i].last);
			}
    		await redisclient.set('mykey', 'Hello from node redis');
    		const myKeyValue = await redisclient.get('mykey');
		await redisclient.quit();
} catch (e) {
    console.error(e);
  }
} nodeRedis();

                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Form Results</title>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #1e1e1e;
                                color: #ffffff;
                                margin: 20px;
                            }

                            h1 {
                                color: #007bff;
                            }

                            p {
                                margin-bottom: 10px;
                            }

                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                                background-color: #2c2c2c;
                                color: #ffffff;
                            }

                            th, td {
                                border: 1px solid #444;
                                padding: 8px;
                                text-align: left;
                            }

                            th {
                                background-color: #007bff;
                                color: #ffffff;
                            }

                            tr:nth-child(even) {
                                background-color: #3c3c3c;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Form Results</h1>
                        <p>Time taken for MySQL select: ${elapsedTimeMySQL} milliseconds</p>
                        <p>New record created successfully</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>First name</th>
                                    <th>Last name</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${selectResult.map(row => `
                                    <tr>
                                        <td>${row.first}</td>
                                        <td>${row.last}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                    </html>
                `);
            });
        });
    });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(dir);
});


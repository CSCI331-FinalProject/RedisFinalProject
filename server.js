const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { exec } = require("child_process");
const app = express();
const port = 3084;
const redis = require('redis');

const dir = `${__dirname}\\public\\`
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));


const dbConfig = {
    host: "localhost",
    user: "user84",
    password: "84adle",
    database: "db84"
};
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

            console.log("New record created successfully");

            // Query to fetch data from the database
            const selectQuery = "SELECT first, last FROM randuser";
            connection.query(selectQuery, (selectErr, selectResult) => {
                if (selectErr) {
                    console.error("Error executing select query:", selectErr);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                // Respond to the client with the data
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <body>
                        <h1>Form Results</h1>
                        <p>New record created successfully</p>
                        <p>First name         Last name</p>
                        ${selectResult.map(row => `<p>${row.first}         ${row.last}</p>`).join('')}
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


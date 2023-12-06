// import mysql from 'mysql';
getBtn.addEventListener("click", getUser); // id is getBtn
const apiButton = document.getElementById("getBtn")
const debug = document.getElementById("debug")
let url = "https://randomuser.me/api"

// getUser()

// getUser(); // hoisting will ensure that functions are defined before this call
apiButton.addEventListener("click", getUser)

function getUser() {
        // fetch returns a promise: pending until it resolves to a response object                    
    fetch(url)
        // now the promise is settled and we we have a response object
        // next: send the settled response as an argument to the next callback 
    .then(decodeData)

    .then(success, fail);
        // if only one argument, catch handles rejected promise
    //.then(success)                                          
    //.catch(fail)
}

function decodeData(response) {     // take the response object as a parameter
    // return (response.json())
    if (response.ok) {              // 200 - 299 is true (200 is success)
        // apiData.innerHTML = "response is " + response.status;
        return (response.json())    // returns promise that resolves to result of parsing as JSON
      }
      else
        throw response.status      // throw an error: the response code
}

function isEnglish(text) {
  // Regular expression to match English characters
  const englishRegex = /^[A-Za-z]+$/;

  // Test if the text contains only English characters
  return englishRegex.test(text);
}
   

function success(userData) {
    // A template literal is of the form `three plus four is ${ 3 + 4 }`
//   let fillHtml=listGenerate(userData);

  const apiFirst = userData.results[0].name.first;
  const apiLast = userData.results[0].name.last;


  if(!isEnglish(apiFirst) || !isEnglish(apiLast)){
    getUser()
  }
  else{

    const apiCountry = userData.results[0].location.country;
    const apiAge = userData.results[0].dob.age;
    const apiLatitude = userData.results[0].location.coordinates.latitude;
    const apiLongitude = userData.results[0].location.coordinates.longitude;
    const picture = userData.results[0].picture.large

    apiData.innerHTML = 
    `<img  class="user" src=${picture} alt="rando user">
    <h2 class="user">Meet ${apiFirst} ${apiLast}</h2>
    <li id="location">Location: ${apiCountry} </li>
    <li id="age">Age: ${apiAge} </li>
    <li id="latitude">Latitude: ${apiLatitude} </li>
    <li id="longitude">Longitude: ${apiLongitude} </li>`;



    apiform = document.querySelector("form")
    apiform.innerHTML = `<input type="hidden" name="first" value="${apiFirst}"/>
    <input type="hidden" name="last" value="${apiLast}"/>
    <input type="hidden" name="country" value="${apiCountry}"/>
    <input type="hidden" name="age" value="${apiAge}"/>
    <input type="hidden" name="latitude" value="${apiLatitude}"/>
    <input type="hidden" name="longitude" value="${apiLongitude}"/>
    
    <input type="submit" id="addBtn" class="btn" value="Add This One"></button>`
  }

}

function fail(error) {
    apiData.innerHTML = "Something went wrong with parsing JSON."
    mdnCodes = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
    apiData.innerHTML+= `<br>The problem: <a href=${mdnCodes}>${error} Error</a>`
}

// ... (previous code)

function executeMySQLQuery() {
  
  const connection = createConnection({
    host: "localhost",
    user: "user78",
    password: "78find",
    database: "db78"
  });

  debug.innerHTML = `<p>Connected to the database</p>`

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }

    const query = 'SELECT * FROM randuser';

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }

      console.log('Query results:', results);

      // Close the database connection when you're done
      connection.end((err) => {
        if (err) {
          console.error('Error closing the database connection:', err);
        }
        console.log('Database connection closed');
      });
    });
  });
}

// Call the function after processing user data
executeMySQLQuery();

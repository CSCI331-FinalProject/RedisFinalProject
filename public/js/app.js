getBtn.addEventListener("click", getUser); // id is getBtn
const apiButton = document.getElementById("getBtn")
let url = "https://randomuser.me/api"
getUser()
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
        apiData.innerHTML = "response is " + response.status;
        return (response.json())    // returns promise that resolves to result of parsing as JSON
      }
      else
        throw response.status      // throw an error: the response code
}
function listGenerate(object) {

            return `<h2> USER DATA </h2> 
            <ul>
            <li>Name: ${object.results[0].name.first} ${object.results[0].name.last}</li>
            <li>Location: ${object.results[0].location.country}  </li>
            <li>Age: ${object.results[0].dob.age}</li>
            <li>Latitude: ${object.results[0].location.coordinates.latitude}</li>
            <li>Longitude: ${object.results[0].location.coordinates.longitude}</li>
          </ul>`


        }
   

function success(userData) {
    // A template literal is of the form `three plus four is ${ 3 + 4 }`
//   let fillHtml=listGenerate(userData);
  console.log(userData)
  apiData.innerHTML = listGenerate(userData)




  const apiFirst = userData.results[0].name.first;
  const apiLast = userData.results[0].name.last;
  const apiCountry = userData.results[0].location.country;
  const apiAge = userData.results[0].dob.age;
  const apiLatitude = userData.results[0].location.coordinates.latitude;
  const apiLongitude = userData.results[0].location.coordinates.longitude;

  apiform = document.querySelector("form")
  apiform.innerHTML = `<input type="hidden" name="first" value="${apiFirst}"/>
  <input type="hidden" name="last" value="${apiLast}"/>
  <input type="hidden" name="country" value="${apiCountry}"/>
  <input type="hidden" name="age" value="${apiAge}"/>
  <input type="hidden" name="latitude" value="${apiLatitude}"/>
  <input type="hidden" name="longitude" value="${apiLongitude}"/>
  
  <input type="submit" id="addBtn" class="btn" value="Add This One"></button>`
}

function fail(error) {
    apiData.innerHTML = "Something went wrong with parsing JSON."
    mdnCodes = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
    apiData.innerHTML+= `<br>The problem: <a href=${mdnCodes}>${error} Error</a>`
}
<!DOCTYPE html>
<html lang="en">

<body>
    <h1>Form Results</h1>
    <?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    if ($_POST) {
        echo "<h2>POST Array:</h2>";
        print_r($_POST);

        $fname = $_POST['first'];
        $lname = $_POST['last'];
        $country=$_POST['country'];
        $age = $_POST['age'];
        $lat = $_POST['latitude'];
        $long = $_POST['longitude'];

        $servername = "localhost";
        $username = "user84";
        $password = "84adle";
        $dbname = "db84";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO randuser (first, last, country, age, latitude, longitude) 
    VALUES ('$fname', '$lname', '$country', $age, $lat, $long);";
    
    if ($conn->query($sql) === TRUE) {
      echo "New record created successfully<br>";
      $result = $conn->query("SELECT first, last FROM randuser");
      echo "First name         Last name <br>";
      if ($result->num_rows > 0) {
        // output data of each row

        while($row = $result->fetch_assoc()) {
          echo $row["first"]. "         " . $row["last"]. "<br>";
    } } }
    else {
      echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();      }   ?>

        <!-- if ($_GET) {
            echo "<h2>GET Array:</h2>";
            print_r($_GET);
        }
 -->

</body>

</html>

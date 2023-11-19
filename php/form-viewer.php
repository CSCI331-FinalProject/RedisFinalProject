<html lang="en">
<head>
    <title>Results</title>
    <style>
    html {
        background-color: gainsboro;
    }
    body {
        font-family: Arial, Helvetica, sans-serif;
        width: 70%;
        padding: 2em;
        margin: 20px auto;
        background-color: white;
    }
    table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    }
    td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    }
    tr:nth-child(even) {
    background-color: #eee;
    }
    </style>
</head>

<body>
<h1>Form Results</h1>
<?php
    if($_POST){
        echo "<h2>Request method: POST</h2>";
        // print_r($_POST);
        $array = $_POST;
    }
    if($_GET){
        echo "<h2>Request method: GET</h2>";
        // print_r($_GET);
        $array = $_GET;
    }

?>
<h2>Key-Value pairs:</h2>
<table>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
<?php 
    foreach ($array as $key => $value) {     // loop through associative array (i.e., map, dictionary)
        echo "<tr>\n<td>" . $key . "</td>";
        echo "<td>";
        if (gettype($value) == "array")     // this works
        // if (is_array($value)) {          // this also works
            foreach ($value as $item)       // loop through indexed array
                echo $item . "<br>";
        else 
            echo $value;
        echo "</td>\n</tr>";
    }
?>
</table>
</body>
</html>
<?php
    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    header("Content-Type: application/json");
    header("Cache-Control: no-cache");

    $query = "SELECT category FROM categories";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);

    $rows = $result->num_rows;

    $returnArr = [];

    for($i = 0; $i < $rows; $i++) {
        $result->data_seek($i);
        $row = $result->fetch_array(MYSQLI_NUM);
        array_push($returnArr, $row[0]);
    }

    echo json_encode($returnArr);

    $result->close();
    $conn->close();
?>
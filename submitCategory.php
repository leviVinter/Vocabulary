<?php
    if(isset($_POST['newCategory'])) {

    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    header("Content-Type: application/json");
    
    $newCategory = $_POST['newCategory'];
    $query = "INSERT INTO categories VALUES(NULL,'$newCategory',1)";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);

    $returnArr = [$newCategory];

    echo json_encode($returnArr);

    $conn->close();
    }
?>
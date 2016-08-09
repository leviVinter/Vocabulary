<?php
    if(isset($_POST['category'])) {

    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    header("Content-Type: application/json");
    
    $category = $_POST['category'];
    $query = "INSERT INTO categories VALUES(NULL,'$category',1)";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);

    $returnArr = [$category];

    echo json_encode($returnArr);

    $conn->close();
    }
?>
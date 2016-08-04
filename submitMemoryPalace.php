<?php
    if(!isset($_POST['name']) || !isset($_POST['places'])) {
        echo "Can't find name or places";
        return;
    }
    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    header("Content-Type: application/json");

    $name = $_POST['name'];
    $string = $_POST['places'];
    $places = explode(",", $string);

    $query = "INSERT INTO memorypalaces(memoryPalaceID,memoryPalace) VALUES(NULL, '$name')";
    $result = $conn->query($query);
    if(!$result) die("Database access failed" . $conn->error);
    $memoryPalaceID = $conn->insert_id;
    for ($i = 0; $i < count($places); $i++) {
        $query = "INSERT INTO places(placeID,place,memoryPalaceID) VALUES(NULL, '$places[$i]', '$memoryPalaceID')";
        $result = $conn->query($query);
        if(!$result) die("Database access failed" . $conn->error);
    }

    $returnArray = [];
    array_push($returnArray, $name);
    for($j = 1; $j < count($places); $j++) {
        array_push($returnArray, $places[$j]);
    }

    echo json_encode($returnArray);
?>
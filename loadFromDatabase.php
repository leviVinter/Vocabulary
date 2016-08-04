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

    $categories = [];

    for($i = 0; $i < $rows; $i++) {
        $result->data_seek($i);
        $row = $result->fetch_array(MYSQLI_NUM);
        array_push($categories, $row[0]);
    }
    $query = "SELECT memoryPalace,memoryPalaceID FROM memorypalaces";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);
    $rows = $result->num_rows;
    $memopals = [];
    for ($j = 0; $j < $rows; $j++) {
        $tempArr = [];
        $result->data_seek($j);
        $row = $result->fetch_array(MYSQLI_NUM);
        array_push($tempArr, $row[0]);
        $subquery = "SELECT place FROM places WHERE places.memoryPalaceID='$row[1]'";
        $subresult = $conn->query($subquery);
        if(!$subresult) die("Database access failed: " . $conn->error);
        $subrows = $subresult->num_rows;
        for ($k = 0; $k < $subrows; $k++) {
            $subresult->data_seek($k);
            $subrow = $subresult->fetch_array(MYSQLI_NUM);
            array_push($tempArr, $subrow[0]);
        }
        array_push($memopals, $tempArr);

    }
    class Obj {
        public $categories, $memopals;
    }
    $returnObj = new Obj();
    $returnObj->categories = $categories;
    $returnObj->memopals = $memopals;
    echo json_encode($returnObj);

    $result->close();
    $conn->close();
?>
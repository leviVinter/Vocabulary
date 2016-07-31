<?php
    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    $category = "AIUEO";

    $query = "SELECT categoryNo FROM categories WHERE category='$category'";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);
    $categoryNo = $result->fetch_array(MYSQLI_NUM);

    $query = "SELECT word,meaning,grammar,story FROM words WHERE categoryNo='$categoryNo[0]'";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);

    $rows = $result->num_rows;

    class wordObject {
        public $word, $meaning, $grammar, $story;
    }
    $wordsArray = [];

    for($j = 0; $j < $rows; $j++) {
        $result->data_seek($j);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $object = new wordObject();
        $object->word = $row["word"];
        $object->meaning = $row["meaning"];
        $object->grammar = $row["grammar"];
        $object->story = $row["story"];
        array_push($wordsArray, $object);
    }

    print_r($wordsArray); echo "<br>";

    $result->close();
    $conn->close();
?>
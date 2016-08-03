<?php
if (isset($_POST['category'])) {
    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    header("Content-Type: application/json");
    header("Cache-Control: no-cache");

    class wordObject {
        public $word, $meaning, $grammar, $story;
    }
    
    $category = $_POST['category'];

    $query = "SELECT categoryID FROM categories WHERE category='$category'";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);
    $categoryID = $result->fetch_array(MYSQLI_NUM);

    $query = "SELECT word,meaning,grammar,story FROM words WHERE categoryID='$categoryID[0]'";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);

    $rows = $result->num_rows;

    $wordsArray = [];
    array_push($wordsArray, $category);

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

    $result->close();
    $conn->close();

    echo json_encode($wordsArray);
} else {
    echo "Can't find category";
}
    ?>
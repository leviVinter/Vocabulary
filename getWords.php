<?php
if (isset($_POST['category'])) {
    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    header("Content-Type: application/json");
    header("Cache-Control: no-cache");

    class wordObject {
        public $wordID, $word, $meaning, $grammar, $category, $memopal, $place, $story;
    }
    
    $category = $_POST['category'];


    $query = "SELECT categoryID FROM categories WHERE category='$category'";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);
    $categoryID = $result->fetch_array(MYSQLI_NUM);

    $query = "SELECT wordID,word,meaning,grammar,story,placeID FROM words WHERE categoryID='$categoryID[0]'";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);

    $rows = $result->num_rows;

    $wordsArray = [];
    
    for($j = 0; $j < $rows; $j++) {
        $result->data_seek($j);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $object = new wordObject();
        $object->wordID = $row["wordID"];
        $object->word = $row["word"];
        $object->meaning = $row["meaning"];
        $object->grammar = $row["grammar"];
        $object->category = $category;
        $object->story = $row["story"];
        $subquery = "SELECT place,memoryPalace FROM places,memorypalaces WHERE placeID='" . 
                    $row['placeID'] . "' AND memorypalaces.memoryPalaceID=places.memoryPalaceID";
        $subresult = $conn->query($subquery);
        if(!$subresult) die("Database access failed in subquery: " . $conn->error);
        $subrow = $subresult->fetch_array(MYSQLI_NUM);
        $object->place = $subrow[0];
        $object->memopal = $subrow[1];
        array_push($wordsArray, $object);
    }

    $result->close();
    $conn->close();

    echo json_encode($wordsArray);
} else {
    echo "Can't find category";
}
    ?>
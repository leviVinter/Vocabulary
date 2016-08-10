<?php
    # Submit category
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
<?php
    # Submit word
    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    if(!isset($_POST['word'])) {
        return;
    }

    $word = $_POST['word'];
    if(!isset($_POST['meaning'])) {
        $meaning = null;
    } else {
        $meaning = $_POST['meaning'];
    }
    if(!isset($_POST['grammar'])) {
        $grammar = null;
    } else {
        $grammar = $_POST['grammar'];
    }
    if(!isset($_POST['category'])) {
        $category = null;
    } else {
        $category = $_POST['category'];
    }
    if(!isset($_POST['memopal']) || $_POST['memopal'] == null) {
        $memopal = null;
        $place = null;
    } else {
        $memopal = $_POST['memopal'];
        $place = $_POST['place'];
    }
    if(!isset($_POST['story'])) {
        $story = null;
    } else {
        $story = $_POST['story'];
    }

    $query = "SELECT categoryID FROM categories WHERE category='$category'";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);
    $categoryID = $result->fetch_array(MYSQLI_NUM);

    if(!empty($place)) {
        $query = "SELECT placeID FROM places WHERE place='$place'";
        $result = $conn->query($query);
        if(!$result) die("Database access failed in places: " . $conn->error);
        $placeID = $result->fetch_array(MYSQLI_NUM);
        $placeID  = "'$placeID[0]'";
    } else {
        $placeID = "NULL";
    }


    $query = "INSERT INTO words(wordID,word,meaning,grammar,story,categoryID,placeID,subjectID) 
            VALUES(NULL, '$word', '$meaning', '$grammar', '$story', '$categoryID[0]', $placeID, 1)";
    $result = $conn->query($query);
    if(!$result) die("Database access failed in words: " . $conn->error);

    class wordObject {
        public $word, $meaning, $grammar, $category, $memopal, $place;
    }
    $returnObj = new wordObject();
    $returnObj->word = $word;
    $returnObj->meaning = $meaning;
    $returnObj->grammar = $grammar;
    $returnObj->category = $category;
    $returnObj->memopal = $memopal;
    $returnObj->place = $place;
    $returnArr = [$returnObj];
    echo json_encode($returnArr);
?>
<?php
# Get Words
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
        $subquery = "SELECT place,memoryPalace FROM places NATURAL JOIN memorypalaces 
                    WHERE placeID='" . $row['placeID'] . "'";
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
<?php
    # Load at startup
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
        $subquery = "SELECT place FROM places WHERE places.memoryPalaceID='$row[1]' ORDER BY placeID";
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
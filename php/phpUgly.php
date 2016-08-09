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
<?php
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
    if(!isset($_POST['memopal'])) {
        $memopal = null;
    } else {
        $memopal = $_POST['memopal'];
    }
    if(!isset($_POST['place'])) {
        $place = null;
    } else {
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

    $query = "SELECT * FROM words WHERE word='$word'";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);
    $returnString = $result->fetch_array(MYSQLI_NUM);

    echo json_encode($returnString);
?>
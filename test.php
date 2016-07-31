<?php
    require_once 'login.php';
    $conn = new mysqli($hn, $un, $pw, $db);
    if($conn->connect_error) die($conn->connect_error);

    // add a new word
    $word = $_POST['word'];
    $meaning = $_POST['meaning'];
    $grammar = $_POST['grammar'];
    $story = $_POST['story'];
    $category = $_POST['category'];
    $subject = $_POST['subject'];
    $place = $_POST['place'];

    $query = "SELECT subjectNo FROM subjects WHERE subject=$subject";
    $result = $conn->query($query);
    $subjectNo = $result->fetch_array(MYSQLI_NUM);

    $query = "SELECT categoryNo FROM categories WHERE category=$category";
    $result = $conn->query($query);
    $categoryNo = $result->fetch_array(MYSQLI_NUM);

    $query = "SELECT placeNo FROM places WHERE place=$place";
    $result = $conn->query($query);
    $placeNo = $result->fetch_array(MYSQLI_NUM);

    $query = "INSERT INTO words(wordNo,word,meaning,grammar,story,categoryNo,placeNo,subjectNo) 
        VALUES(NULL, $word, $meaning, $grammar, $story, $categoryNo[0], $placeNo[0], $subjectNo[0])";
    $result = $conn->query($query);
    if(!$result) die("Database access failed: " . $conn->error);

    // display words in category
    $category = $_POST['category'];

    $query = "SELECT categoryNo FROM categories WHERE category=$category";
    $result = $conn->query($query);
    $categoryNo = $result->fetch_array(MYSQLI_NUM);

    $query = "SELECT word,meaning,grammar,story FROM words WHERE categoryNo=$categoryNo[0]";
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

    $result->close();
    $conn->close();

?>
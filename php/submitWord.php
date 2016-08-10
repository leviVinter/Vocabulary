<?php
    if(!isset($_POST['word']) || !isset($_POST['subject']) || !isset($_POST['category'])) die("Param is not set");
    try {
        require_once 'login.php';
        $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $word = $_POST['word'];
        $subject = $_POST['subject'];
        $category = $_POST['category'];
        if(!isset($_POST['meaning'])) {
            $meaning = "";
        } else {
            $meaning = $_POST['meaning'];
        }
        if(!isset($_POST['grammar'])) {
            $grammar = "";
        } else {
            $grammar = $_POST['grammar'];
        }
        
        if(!isset($_POST['memopal']) || $_POST['memopal'] == null) {
            $memopal = null;
            $place = null;
        } else {
            $memopal = $_POST['memopal'];
            $place = $_POST['place'];
        }
        if(!isset($_POST['story'])) {
            $story = "";
        } else {
            $story = $_POST['story'];
        }

        $stmt = $conn->prepare('SELECT categoryID,subjectID FROM categories NATURAL JOIN subjects WHERE category=:category
                                AND subject=:subject');
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':subject', $subject);
        $stmt->execute(); 
        $row = $stmt->fetch();
        $categoryID = $row[0];
        $subjectID = $row[1];

        if(!empty($memopal)) {
            $stmt = $conn->prepare('SELECT placeID FROM places NATURAL JOIN memorypalaces 
                                    WHERE memoryPalace=:memopal AND place=:place');
            $stmt->bindParam(':memopal', $memopal);
            $stmt->bindParam(':place', $place);
            $stmt->execute();
            $row = $stmt->fetch();
            $placeID = $row[0];
        } else {
            $placeID = null;
        }

        $stmt = $conn->prepare('INSERT INTO words(wordID,word,meaning,grammar,story,categoryID,placeID,subjectID)
                                VALUES(NULL, :word, :meaning, :grammar, :story, :categoryID, :placeID, :subjectID)');
        $stmt->execute(array(
            ':word' => $word,
            ':meaning' => $meaning,
            ':grammar' => $grammar,
            ':story' => $story,
            ':categoryID' => $categoryID,
            ':placeID' => $placeID,
            ':subjectID' => $subjectID));
        
        $returnArr = [$category];
        
        class wordObject {
            public $word, $meaning, $grammar, $memopal, $place;
        }
        $wordObj = new wordObject();
        $wordObj->word = $word;
        $wordObj->meaning = $meaning;
        $wordObj->grammar = $grammar;
        $wordObj->memopal = $memopal;
        $wordObj->place = $place;
        $returnArr[] = $wordObj;
        echo json_encode($returnArr);

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>
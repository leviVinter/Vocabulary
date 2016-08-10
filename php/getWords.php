<?php
    if(!isset($_POST['category']) || !isset($_POST['subject'])) die("Param is not set");

    try {
        require_once 'login.php';
        $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare('SELECT categoryID FROM categories NATURAL JOIN subjects 
                                WHERE category=:category AND subject=:subject');
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':subject', $subject);
        $category = $_POST['category'];
        $subject = $_POST['subject'];
        $stmt->execute();
        $row = $stmt->fetch();
        $categoryID = $row[0];

        $stmt = $conn->prepare('SELECT wordID,word,meaning,grammar,story,placeID FROM words
                                WHERE categoryID=:categoryID');
        $stmt->bindParam(':categoryID', $categoryID);
        $stmt->execute();

        class wordObject {
            public $wordID, $word, $meaning, $grammar, $category, $memopal, $place, $story;
        }

        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $wordsArray = [$category];
        while($row = $stmt->fetch()) {
            $object = new wordObject();
            $object->wordID = $row['wordID'];
            $object->word = $row['word'];
            $object->meaning = $row['meaning'];
            $object->grammar = $row['grammar'];
            $object->story = $row['story'];
            $substmt = $conn->prepare('SELECT place,memoryPalace FROM places NATURAL JOIN memorypalaces
                                        WHERE placeID=:placeID');
            $substmt->bindParam(':placeID', $row['placeID']);
            $substmt->execute();
            $subrow = $substmt->fetch();
            $object->place = $subrow[0];
            $object->memopal = $subrow[1];
            $wordsArray[] = $object;
        }

        echo json_encode($wordsArray);

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    $conn = null;
?>
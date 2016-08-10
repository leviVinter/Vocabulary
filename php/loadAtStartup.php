<?php
    if (!isset($_POST['subject'])) die("Params is not set");

    try {
        require_once 'login.php';
        $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare('SELECT subject FROM subjects WHERE subject NOT IN (:subject)');
        $stmt->bindParam(':subject', $subject);
        $subject = $_POST['subject'];
        $stmt->execute();
        $subjectArr = [];
        $subjectArr[] = $subject;
        while ($row = $stmt->fetch()) {
            $subjectArr[] = $row[0];
        }

        $stmt = $conn->prepare('SELECT category FROM categories NATURAL JOIN subjects
                                WHERE subject=:subject ORDER BY categoryID');
        $stmt->bindParam(':subject', $subject);
        $stmt->execute();
        $categories = [];
        while ($row = $stmt->fetch()) {
            $categories[] = $row[0];
        }
        $stmt = $conn->prepare('SELECT memoryPalace FROM memorypalaces ORDER BY memoryPalaceID');
        $stmt->execute();
        # Make arrays, in the second array each row will contain memopal name and all its places
        # Each of those will then be pushed into the first
        $memopals = [];
        while ($row = $stmt->fetch()) {
            $memopalAndPlaces = [];
            $memopal = $row[0];
            $memopalAndPlaces[] = $memopal;
            $substmt = $conn->prepare('SELECT place FROM places NATURAL JOIN memorypalaces
                                        WHERE memoryPalace=:memopal ORDER BY placeID');
            $substmt->bindParam(':memopal', $memopal);
            $substmt->execute();
            while ($subrow = $substmt->fetch()) {
                $memopalAndPlaces[] = $subrow[0];
            }
            $memopals[] = $memopalAndPlaces;
        }
        class Obj {
            public $subjects, $categories, $memopals;
        }   
        $returnObj = new Obj();
        $returnObj->subjects = $subjectArr;
        $returnObj->categories = $categories;
        $returnObj->memopals = $memopals;
        echo json_encode($returnObj);
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    $conn = null;
?>
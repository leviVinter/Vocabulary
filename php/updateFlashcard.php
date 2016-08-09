<?php

require_once 'login.php';
try {
    $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    if (!empty($_POST['memopal'])) {
        $stmt = $conn->prepare('SELECT memoryPalaceID FROM memorypalaces WHERE memoryPalace=:memopal');
        $memopal = $_POST['memopal'];
        $stmt->bindParam(':memopal', $memopal);
        $stmt->execute();
        $memopalID = $stmt->fetch();
        $stmt = $conn->prepare('SELECT placeID FROM places WHERE place=:place AND memoryPalaceID=:memopalID');
        $place = $_POST['place'];
        $stmt->bindParam(':place', $place);
        $stmt->bindParam(':memopalID', $memopalID[0]);
        $stmt->execute();
        $placeID = $stmt->fetch();
        $placeID = $placeID[0];
    } else {
        $placeID = NULL;
    }
    $stmt = $conn->prepare('UPDATE words SET meaning=:meaning,grammar=:grammar,placeID=:placeID,story=:story 
                            WHERE wordID=:wordID');
    $meaning = $_POST['meaning'];
    $grammar = $_POST['grammar'];
    $story = $_POST['story'];
    $wordID = $_POST['wordID'];
    $stmt->execute(array(
                    ':meaning' => $meaning,
                    ':grammar' => $grammar,
                    ':placeID' => $placeID,
                    ':story' => $story,
                    ':wordID' => $wordID));
    echo json_encode(true);
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;
?>
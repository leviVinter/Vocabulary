<?php
    require_once 'login.php';
    try {
        $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare('SELECT memoryPalaceID,placeID FROM memorypalaces NATURAL JOIN places 
                                WHERE memorypalaces.memoryPalace=:memopal ORDER BY places.placeID');
        $memopal = $_POST['memopal'];
        $stmt->bindParam(':memopal', $memopal);
        $stmt->execute();
        $placeIDs = [];
        $row = $stmt->fetch();
        $memopalID = $row[0];
        $placeIDs[] = $row[1];
        while($row = $stmt->fetch()) {
            $placeIDs[] = $row[1];
        }
        $places = explode(",", $_POST['places']);

        $stmt = $conn->prepare('UPDATE places SET place=:place WHERE placeID=:placeID');
        $stmt->bindParam(':place', $place);
        $stmt->bindParam(':placeID', $placeID);
        for($i = 0; $i < count($places); $i++) {
            $place = $places[$i];
            $placeID = $placeIDs[$i];
            $stmt->execute();
        }

        echo json_encode(true);
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>
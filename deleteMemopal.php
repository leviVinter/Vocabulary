<?php
    if(!isset($_POST['memopal'])) die();

    require_once 'login.php';

    try {
        $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $memopal = $_POST['memopal'];

        $stmt = $conn->prepare('SELECT memorypalaceID FROM memorypalaces WHERE memorypalace = :memopal');
        $stmt->bindParam(':memopal', $memopal);
        $stmt->execute();
        $memopalId = $stmt->fetch();

        $stmt = $conn->prepare('UPDATE words,places SET words.placeID=NULL WHERE words.placeID=places.placeID
                            AND places.memoryPalaceID=:memopalId');
        $stmt->bindParam(':memopalId', $memopalId[0]);
        $stmt->execute();

        $stmt = $conn->prepare('DELETE memorypalaces,places FROM memorypalaces INNER JOIN places 
                                WHERE memorypalaces.memoryPalaceID=places.memoryPalaceID 
                                AND memorypalaces.memoryPalaceID=:memopalId');
        $stmt->bindParam(':memopalId', $memopalId[0]);
        $stmt->execute();
        echo json_encode($memopal);

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>
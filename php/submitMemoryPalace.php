<?php
    if(!isset($_POST['memopal'])) die("Params is not set");

    try {
        require_once 'login.php';
        $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $conn->prepare('INSERT INTO memorypalaces(memoryPalaceID,memoryPalace)
                                VALUES(NULL, :memopal)');
        $stmt->bindParam(':memopal', $memopal);
        $memopal = $_POST['memopal'];
        $stmt->execute();
        $memopalID = $conn->lastInsertId();

        $str = $_POST['places'];
        $places = explode(",", $str);
        
        $sql = 'INSERT INTO places(placeID,place,memoryPalaceID) VALUES ';
        $sqlParts = [];
        for ($i = 0; $i < count($places); $i++) {
            $sqlParts[] = "(NULL,?," . $memopalID . ")";
        }
        $sql .= implode(",", $sqlParts);

        $stmt = $conn->prepare($sql);
        $stmt->execute($places);

        $memopalAndPlaces = [];
        $memopalAndPlaces[] = $memopal;
        for($j = 0; $j < count($places); $j++) {
            $memopalAndPlaces[] = $places[$j];
        }
        $returnArr = [$memopalAndPlaces];
        echo json_encode($returnArr);
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>
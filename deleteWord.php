<?php
    require_once 'login.php';
try {
    if (!isset($_POST['wordID'])) die();
    $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $wordID = $_POST['wordID'];

    $stmt = $conn->prepare('DELETE FROM words WHERE wordID=:wordID');
    $stmt->bindParam(':wordID', $wordID);
    $stmt->execute();
    echo json_encode($wordID);
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$conn = null;
?>
<?php

if (!isset($_POST['category'])) die();

require_once 'login.php';

try {
    $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare('DELETE FROM categories WHERE category = :category'); 
            
    $stmt->bindParam(':category', $category);
    $category = $_POST['category'];
    $stmt->execute();

    $wordIds = $_POST['wordIds'];
    $wordIdsArr = explode(",", $wordIds);
    /*$stmt = $conn->prepare('DELETE FROM words WHERE wordID = :wordID');

    for($i = 0; $i < count($wordIdsArr); $i++) {
        $stmt->bindParam(':wordID', $wirdIdsArr[i]);
        $stmt->execute();
    }*/
    $inClause = implode(',', array_fill(0, count($wordIdsArr), '?'));
    $sql = 'DELETE FROM words WHERE wordID IN (%s)';
    $prepareSql = sprintf($sql, $inClause);
    $stmt = $conn->prepare($prepareSql);
    $stmt->execute($wordIdsArr);

    echo json_encode($category);

} catch(PDOException $e) {
    echo "Error: " + $e->getMessage();
}
$conn = null;
?>

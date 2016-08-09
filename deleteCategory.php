<?php

if (!isset($_POST['category'])) die();

require_once 'login.php';

try {
    $category = $_POST['category'];
    $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare('SELECT categoryID FROM categories WHERE category=:category');
    $stmt->bindParam(':category', $category);
    $stmt->execute();
    $row = $stmt->fetch();
    $categoryID = $row[0];

    $stmt = $conn->prepare('DELETE categories,words FROM categories INNER JOIN words 
                        WHERE categories.categoryID = words.categoryID 
                        AND categories.categoryID = :categoryID'); 
            
    $stmt->bindParam(':categoryID', $categoryID, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode($category);

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;
?>

<?php
    if(!isset($_POST['category']) || !isset($_POST['subject'])) die("Params are not set");

    try {
        require_once 'login.php';
        $conn = new PDO("mysql:host=$hn;dbname=$db", $un, $pw);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $stmt = $conn->prepare('SELECT subjectID FROM subjects WHERE subject=:subject');
        $stmt->bindParam(':subject', $subject);
        $subject = $_POST['subject'];
        $stmt->execute();
        $row = $stmt->fetch();
        $subjectID = $row[0];

        $category = $_POST['category'];
        $categoryLength = count($category);
        $stmt = $conn->prepare('INSERT INTO categories VALUES(NULL, :category, :subjectID)');
        $stmt->bindParam(':category', $category, PDO::PARAM_STR);
        $stmt->bindParam(':subjectID', $subjectID, PDO::PARAM_INT);
        $stmt->execute();

        $returnArr = [$category];
        echo json_encode($returnArr);

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    $conn = null;
?>
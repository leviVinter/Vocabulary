<?php
    class wordObject {
        public $word, $meaning, $grammar, $story;
    }
    $test = [];

    $word1 = "hello";
    $word2 = "hi";
    $word3 = "no";
    $word4 = "way";
    $word5 = "jose";
    $test2 = array($word1, $word2, $word3, $word4, $word5);

    for($i = 0; $i < 3; $i++) {
        $word = new wordObject();
        $word->word = $test2[$i];
        $word->meaning = $test2[$i+1];
        array_push($test, $word);
    }
    print_r($test); echo "<br>";
?>
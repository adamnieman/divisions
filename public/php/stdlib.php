<?php
    function __autoload($class) {
        include "php/$class.php";
    }
?>
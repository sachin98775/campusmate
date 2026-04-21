<?php
// Simulate POST request for testing
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST = json_decode('{"role":"teacher","teacherKey":"KCPT001"}', true);

// Include the temp login script
include 'temp-login.php';
?>

<?php 
require_once('../../../wp-load.php'); 
$url = $_POST['term']; $index = $_POST["index"];
$urlArray = explode('(%*)',$url);
$urlReturn = $urlArray[$index];
update_option( 'linkVal',$urlReturn ); 
update_option( 'dateCron',date ('d') ); 
?>
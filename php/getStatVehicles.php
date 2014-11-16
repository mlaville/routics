<?php
/*
*/
include 'ident.inc.php';
include './soap/configSoap.inc.php';

include 'connect.inc.php';
include 'funcStatVehicles.php';

$response = identSoap( $login );
if( $response["success"] ){
	$response = statVehicle($dbFlotte, $_POST);
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>

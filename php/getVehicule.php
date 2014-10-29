<?php
/*
*/
include 'ident.inc.php';
include './soap/configSoap.inc.php';
include 'fonctionSoap.inc.php';

function cmp($a, $b) {
    return intval( $a->VehicleID ) - intval( $b->VehicleID );
}

$response = identSoap( $login );

if( $response["success"] ) {
	$dateRef = date( DateTime::W3C, mktime(0, 0, 0, date("m")  , date("d")-30, date("Y")) ); // '2013-03-26T00:51:30+00:00'
	$resultVehicule = soapGetVehicles( $wsdl, $login, $dateRef );

	$response["result"] = $resultVehicule->Get_VehiclesResult->Vehicles->VehicleResult;

	usort($response["result"], "cmp");
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>

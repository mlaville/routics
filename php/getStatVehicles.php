<?php
/**
 * getStatVehicles.php
 *
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       30/09/2015
 * @version    0.2
 * @revision   $0$
 *
 * 
 * Construit la reponse pour les stat véhicule ou les releves KM
 */
include 'ident.inc.php';
include './soap/configSoap.inc.php';

include 'connect.inc.php';
include './database/funcStatVehicles.php';

$response = identSoap( $login );
if( $response["success"] ){
	if( isset($_POST['mois']) ) {
		$response = loadKmMensuel($dbFlotte, $_POST['mois']);
	} else {
		$response = statVehicle($dbFlotte, $_POST);
	}
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
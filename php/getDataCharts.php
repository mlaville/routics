<?php
/*
 * getDataCharts.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date      08/05/2015
 * @version    0.1
 * @revision   $0
 *
 * Remontée des km compteur
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'ident.inc.php';
include './soap/configSoap.inc.php';

include 'connect.inc.php';
include './database/dataCharts.php';

$response = identSoap( $login );
if( $response["success"] ) {
	$response = chargeDataKm( $dbFlotte, $_POST['vehiculeId'] );
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>

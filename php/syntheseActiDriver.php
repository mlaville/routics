<?php
/**
 * 
 * syntheseActiDriver.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       10/11/3013
 * @version    0.6
 * @revision   $0
 *
 * Calcul des relevés d'activite
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

include 'ident.inc.php';
include 'soap/configSoap.inc.php';
include 'soap/funcActiDrivers.php';

// Rapporte les erreurs d'exécution de script
// error_reporting(E_ERROR | E_WARNING | E_PARSE);
error_reporting(E_ERROR);

$response = identSoap( $login );

if( $response["success"] ) {
	date_default_timezone_set ( 'Europe/Paris' );

	$idTransicsDrivers = isset( $_POST['idDriver'] ) ? $_POST['idDriver'] : '22';
	$dateInf =  isset( $_POST['dateInf'] ) ? $_POST['dateInf'] : '2013-10-01';
	$dateSup =  isset( $_POST['dateSup'] ) ? $_POST['dateSup'] : '2013-10-09';

	$response["retour"] = getActiDriverPeriode( $wsdl, $login, $idTransicsDrivers, date_create($dateInf), date_create($dateSup) );
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
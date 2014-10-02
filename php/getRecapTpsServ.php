<?php
/**
 * getRecapTpsServ.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       04/11/2013
 * @version    0.1.0
 * @revision   $0$
 *
 *
 * Charge les données d'affichage du recap temps de service
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'soap/configSoap.inc.php';

include 'connect.inc.php';
include 'calcRecapTpsServ.php';

$mois = ( isset($_POST['mois']) ) ? $_POST['mois'] : '2014-10' /* date('Y-m')*/ ;

$retour = recapTmsService( $wsdl, $login, $dbFlotte, $mois );

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $retour ), ENT_QUOTES );
?>
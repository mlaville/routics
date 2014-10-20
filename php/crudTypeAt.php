<?php
/**
 * crudTypeAt.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date      19/12/2013
 * @version    0.1
 * @revision   $0$
 *
 * Création et suppression des Types d'Arret de Travail
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

include './connect.inc.php';
include './database/crudTypeATfunc.php';

$response = null;
$cmd = isset( $_POST["cmd"] ) ? $_POST["cmd"] : 'read';
		$ident = isset( $_POST["ident"] ) ? $_POST["ident"] : null;

// load or save?
switch($cmd) {
	case "create":
		break;
		
		
	case "read":
		$response = readTypeAT($dbFlotte);
		break;
		
	case "update":

		if( !($ident > 0) ) {
			$response = createTypeAT($dbFlotte);
			$ident = $response["success"] ? $response["result"] : 0;
		}

		if( $ident > 0 ) {
			$response = updateTypeAT($dbFlotte, $ident, $_POST["libelle"], $_POST["code"], $_POST["duree"], $_POST["couleur"] );
			$response = readTypeAT($dbFlotte);
		}
		break;
		
	case "delete":
		if( $ident > 0 ) {
//			$response = deleteTypeAT( $dbFlotte, $ident, $login->Dispatcher );
			$response = deleteTypeAT( $dbFlotte, $ident );
		}
		$response = readTypeAT($dbFlotte);
		break;
	
	default:
		$response["success"] = false;
		$response["reason"] = array("reason"=>'Commande Invalide');
		break;
}

/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
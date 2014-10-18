<?php
/**
 * validRecap.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
 * @date      04/11/2013
 * @version    0.1
 * @revision   $0$
 *
 * @date revision 20/05/2014 Tableau des Heures Dues
 * @date revision 30/09/2014 Trace la valeur de _POST en validation
 *
 * validation des récapitulatifs mensuel d'activite conducteur et gestion des Heures Dues
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'ident.inc.php';
include 'soap/configSoap.inc.php';

include 'connect.inc.php';
include 'database/crudRecap.php';

file_put_contents( '../data/validRecap-' . date_format( date_create('now'), 'Y-m-d-His' ) . '.json', json_encode($_POST) );
$response = identSoap( $login );
if( $response["success"] ) {
	// get command
	$response["success"] = isset($_POST["cmd"]);
	if( $response["success"] ) {
	
		$cmd = $_POST["cmd"];

		// load or save?
		switch($cmd) {
			case "validRecap":
				$rep = enregistreRecap($dbFlotte, $_POST['mois'], $_POST['data'], $_SESSION['ident']);
				$response["success"] = $rep["success"];
				
				break;
				
			case "validHrDues":
				$rep = enregistreHeuresDues($dbFlotte, $_POST['mois'], $_POST['data'], $_SESSION['ident']);
				$response["success"] = $rep[0]["success"];

				break;
			
			default:
				$response["success"] = false;
				$response["reason"] = array("reason"=>'Commande Invalide');
				break;
		}
	} else {
		$response["error"] = array( "reason"=>'Paramêtres Invalides' );
	}
} else {
	$response["error"] = array( "reason"=>'Défaut Identification' );
}
	
header("Content-Type: application/json");
echo htmlspecialchars_decode(json_encode($response), ENT_QUOTES);
?>
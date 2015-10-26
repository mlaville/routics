<?php
/**
 * crudArretTravail.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date      24/06/2013
 * @version    0.1
 * @revision   $0$
 *
 * Création et suppression des Arret de Travail
 *
 * - A Faire : Gestion des erreurs
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'ident.inc.php';
include 'soap/configSoap.inc.php';

include 'connect.inc.php';

function insertAT($dbConn, $personTransicsID, $at_type, $at_date, $user) {

	$stmt = $dbConn->prepare( "INSERT INTO t_arret_travail_at ( at_PersonTransicsID, at_date, at_type_fk, at_duree, at_user, at_date_crea )"
							. " SELECT ?, ?, IdTypeAt, tpa_duree, ?, NOW() FROM t_type_at_tpa WHERE IdTypeAt = ?" );

	$rep = array( "success"=>$stmt->execute( array( $personTransicsID, $at_date, $user, $at_type ) ) );
	
	if( $rep["success"] ) {
		$rep["id"] = $dbConn->lastInsertId();
		$stmt = $dbConn->prepare( "SELECT at_duree, tpa_couleur FROM t_arret_travail_at, t_type_at_tpa WHERE at_type_fk = IdTypeAt AND IdAT = ?" );
		$stmt->execute( array( $rep["id"] ) );
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$rep["duree"] = intval( $result[0]['at_duree'] );	
		$rep["couleur"] =  $result[0]['tpa_couleur'];
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}
	
	return $rep;	
}

function deleteAT($dbConn, $personTransicsID, $at_date, $user) {

	$stmt = $dbConn->prepare( "SELECT IdAT, at_duree FROM t_arret_travail_at WHERE at_PersonTransicsID = ? AND at_date = ?");
	
	$rep = array( "success"=>$stmt->execute( array( $personTransicsID, $at_date ) ) );
	
	if( $rep["success"] ) {
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if( count($result) > 0 ) {
			$rep["id"] =  $result[0]['IdAT'];
			$rep["duree"] = intval( $result[0]['at_duree'] );	
			$stmt = $dbConn->prepare( "DELETE FROM t_arret_travail_at WHERE IdAT = ?");
			$rep["delete"] = $stmt->execute( array( $rep["id"] ) );
		} else {
			$rep["error"] = array( "reason"=>"Pas de record à supprimer", "personTransicsID"=>$personTransicsID , "personTransicsID"=>$personTransicsID );
		}

	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}
	
	return $rep;	
}
	
$response = identSoap( $login );
if( $response["success"] ) {
	// get command
	$response["success"] = isset($_POST["cmd"], $_POST["driverIdTransics"], $_POST["dateArret"] );
	if( $response["success"] ) {
	
		$cmd = $_POST["cmd"];

		// load or save?
		switch($cmd) {
			case "create":
				$response = insertAT( $dbFlotte, $_POST["driverIdTransics"], $_POST["typeArret"], $_POST["dateArret"], $login->Dispatcher );
				break;
				
			case "delete":
				$response = deleteAT( $dbFlotte, $_POST["driverIdTransics"], $_POST["dateArret"], $login->Dispatcher );
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
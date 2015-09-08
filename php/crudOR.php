<?php
/**
 * crudOR.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       06/05/2013
 * @version    0.5.1
 * @revision   $0$
 *
 * A Faire : 
 * - Gestion des erreurs
 * - Formalisation de l'API
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'ident.inc.php';
include './soap/configSoap.inc.php';

include 'connect.inc.php';

function loadStat($dbConn, $unIdVehicle) {
	$reqSelectOr = "SELECT YEAR(BeginDate) AS Annee, MAX(KmEnd) - MIN(KmBegin) AS KmParcourus"
		. " FROM t_km_parcourt"
		. " WHERE Vehicle = ?"
		. " GROUP BY YEAR(BeginDate) ASC";

	$stmt = $dbConn->prepare( $reqSelectOr );
	$rep = array( "success"=>$stmt->execute( array( $unIdVehicle ) ) );
	
	if( $rep["success"] ) {
		$result = $stmt->fetchAll();
		$stat = array();
		foreach ($result as &$an) {
			$stat[] = array( $an["Annee"] => $an["KmParcourus"] );
		}
		$rep["result"] = $stat;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;

}

function loadOr($dbConn, $unIdVehicle) {
	$reqSelectOr = "SELECT IdOR, or_date, or_km, or_prestataire, or_numFacture, ROUND( or_montant / 100, 2 ) AS or_montant, or_description, or_user, or_date_saisie"
				. "	FROM t_or WHERE or_date_annule IS NULL AND or_idVehicle = ? ORDER BY or_date DESC";

	$stmt = $dbConn->prepare( $reqSelectOr );
	$rep = array( "success"=>$stmt->execute( array( $unIdVehicle ) ) );
	
	if( $rep["success"] ) {
		$result = $stmt->fetchAll();
		foreach ($result as &$or) {
			$or["or_date"] = implode( '/', array_reverse( explode( '-', $or["or_date"] ) ) );
		}
		$rep["result"] = $result;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;
}

function updateOr($dbConn, $arrOr, $user) {
	$reqUpdatetOr = "UPDATE t_or SET or_date = ?, or_km = ?, or_prestataire = ?, or_numFacture = ?, or_montant = ? * 100, or_description = ?"
		. " WHERE IdOR = ?";

	$dateOr = implode( '-', array_reverse( explode( '/', $arrOr["dateOr"] ) ) );
	$stmt = $dbConn->prepare( $reqUpdatetOr );
	$tabParam = array( $dateOr,
						$arrOr["kmOR"],
						$arrOr["lieuOR"],
						$arrOr["numFactOR"],
						$arrOr["montantOR"],
						$arrOr["descriptOr"]
//						,$user
						, $arrOr["idOr"]

					);
	$rep = array( "success"=>$stmt->execute( $tabParam ) );
	
	if( $rep["success"] ) {
		$rep = loadOr($dbConn, $arrOr["idVehicule"]);
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}
	
	return $rep;
}

$response = identSoap( $login );
if( $response["success"] ) {
	// get command
	$response["success"] = isset($_REQUEST["cmd"]);
	if( $response["success"] ) {
	
		$cmd = $_REQUEST["cmd"];

		$reqInsertOr = "INSERT INTO t_or ( or_idVehicle, or_TransicsVehicleId, or_date, or_km, or_prestataire, or_numFacture, or_montant, or_description, or_user, or_date_saisie )"
			. " VALUES ( ?, ?, ?, ?, ?, ?, ? * 100, ?, ?, NOW( ) )";

		$reqAnnuleOr = "UPDATE t_or SET or_date_annule=NOW() WHERE IdOR = ?";
		
		// load or save?
		switch($cmd) {
			case "create":
				$dateOr = implode( '-', array_reverse( explode( '/', $_POST["dateOR"] ) ) );
				$stmt = $dbFlotte->prepare( $reqInsertOr );
				$tabParam = array( $_POST["idVehicule"],
									$_POST["idTransics"],
									$dateOr,
									$_POST["kmOR"],
									$_POST["lieuOR"],
									$_POST["numFactOR"],
									$_POST["montantOR"],
									$_POST["descriptOr"],
									$login->Dispatcher
								);
				$stmt->execute( $tabParam );
									
				$res = loadOr( $dbFlotte, $_POST["idVehicule"] );
				
				$response["success"] = $res["success"];

				if( $response["success"] ) {
					$response["result"] = $res["result"];
				} else {
					$response["error"] = $response["error"];
				}
				
			break;
			
			case "read":
			case "load":
				$res = loadOr( $dbFlotte, $_POST["idVehicule"] );
				
				$response["success"] = $res["success"];
				if( $response["success"] ) {
					$response["result"] = $res["result"];
					$response["stat"] = loadStat( $dbFlotte, $_POST["idVehicule"] );
					
				} else {
					$response["error"] = $response["error"];
				}
				break;
			
			case "update":
				$tabParam = array( "idOr"=>$_POST["idOr"],
									"idVehicule"=>$_POST["idVehicule"],
									"dateOr"=>$_POST["dateOR"],
									"kmOR"=>$_POST["kmOR"],
									"lieuOR"=>$_POST["lieuOR"],
									"numFactOR"=>$_POST["numFactOR"],
									"montantOR"=>$_POST["montantOR"],
									"descriptOr"=>$_POST["descriptOr"]);
				$res = updateOr( $dbFlotte, $tabParam, $login->Dispatcher );

				$response["success"] = $res["success"];
				if( $response["success"] ) {
					$response["result"] = $res["result"];
				} else {
					$response["error"] = $response["error"];
				}
				break;
				
			
			case "delete":
				$stmt = $dbFlotte->prepare( $reqAnnuleOr );
				$stmt->execute( array( $_POST["idOr"] ) );
				
//				$response["succes"] = true;
				
			break;
			
			default;
			break;
		}
	} else {
		$response["error"] = array( "reason"=>"No command" );
	}
} else {
	$response["error"] = array( "reason"=>"Identification" );
}
// return response to client
header("Content-Type: application/json");
echo htmlspecialchars_decode(json_encode($response), ENT_QUOTES);
?>
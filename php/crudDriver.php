<?php
/**
 * crudDriver.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
 * @date       18/06/2013
 * @version    0.1
 * @revision   $0$
 *
 * @date revision 08/07/2014 Test le $_POST["transicsId"] avant le switch cmd
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'ident.inc.php';
include './soap/configSoap.inc.php';

include 'connect.inc.php';

function insertDriver($dbConn, $idTransics, $user) {

	$stmt = $dbConn->prepare( "INSERT INTO t_driver ( PersonTransicsID, drv_user, drv_dateImport ) VALUES ( ?, ?, NOW( ) )" );
	$rep = array( "success"=>$stmt->execute( array( $idTransics, $user ) ) );
	
	if( $rep["success"] ) {
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}
	
	return $rep;	
}

function existDriver( $dbConn, $idTransics ) {
	
	$stmt = $dbConn->prepare( "SELECT COUNT(*) AS nbDrivers FROM t_driver WHERE PersonTransicsID = ?" );
	$reponse = array( "success"=>$stmt->execute( array( $idTransics ) ) );
	
	if( $reponse["success"] ) {
		$result = $stmt->fetch();
		$reponse["exist"] = ($result["nbDrivers"] > 0);
	} else {
		$err = $stmt->errorInfo();
		$reponse["error"] = array( "reason"=>$err[2] );
	}

	return $reponse;	
}

$response = identSoap( $login );
if( $response["success"] ) {
	// get command
	$response["success"] = isset($_REQUEST["cmd"]);
	if( $response["success"] ) {
	
		$cmd = $_REQUEST["cmd"];
		if( isset( $_POST["transicsId"] ) ) {
			$idTransics = $_POST["transicsId"];
			
			// load or save?
			switch($cmd) {
				case "updateTT":
					$rep = existDriver( $dbFlotte, $idTransics );
					$response["exist"] = $rep;
					if( $rep["exist"] == false ) {
						$response["insert"] = insertDriver( $dbFlotte, $idTransics, $login->Dispatcher );
					} else {
						$response["insert"] = false;
					}
					
					$stmt = $dbFlotte->prepare( "UPDATE t_driver SET drv_tmp_serv_mois = ? WHERE PersonTransicsID = ? LIMIT 1" );
					$response["success"] = $stmt->execute( array( $_POST["quota"], $idTransics ) );

					if( $response["success"] ) {
						$response["update"] = $stmt->rowCount();
					} else {
						$err = $stmt->errorInfo();
						$response["error"] = array( "reason"=>$err[2] );
					}
				break;
				
				case "updateReserve":
					$rep = existDriver( $dbFlotte, $idTransics );
					$response["exist"] = $rep;
					if( $rep["exist"] == false ) {
						$response["insert"] = insertDriver( $dbFlotte, $idTransics, $login->Dispatcher );
					} else {
						$response["insert"] = false;
					}
					$stmt = $dbFlotte->prepare( "UPDATE t_driver SET drv_tmp_reserve = ? WHERE PersonTransicsID = ? LIMIT 1" );
					$response["success"] = $stmt->execute( array( $_POST["reserve"], $idTransics ) );

					if( $response["success"] ) {
						$response["update"] = $stmt->rowCount();
					} else {
						$err = $stmt->errorInfo();
						$response["error"] = array( "reason"=>$err[2] );
					}
					
				break;
				
				case "updateColor":
					$rep = existDriver( $dbFlotte, $idTransics );
					$response["exist"] = $rep;
					if( $rep["exist"] == false ) {
						$response["insert"] = insertDriver( $dbFlotte, $idTransics, $login->Dispatcher );
					} else {
						$response["insert"] = false;
					}
					$attribut = ( $_POST["bg"] == 1 ) ? 'drv_bgcolor' : 'drv_color';
					$stmt = $dbFlotte->prepare( "UPDATE t_driver SET $attribut = ? WHERE PersonTransicsID = ? LIMIT 1" );
					$response["success"] = $stmt->execute( array( $_POST["couleur"], $idTransics ) );

					if( $response["success"] ) {
						$response["update"] = $stmt->rowCount();
					} else {
						$err = $stmt->errorInfo();
						$response["error"] = array( "reason"=>$err[2] );
					}
				break;
				
				/* Valide la jointure Transics/Optigest */
				case "updateJointure":
					$idOptigest = isset( $_POST["optigestId"] ) ? $_POST["optigestId"] : null;
					
					$stmt = $dbFlotte->prepare( "REPLACE INTO tj_transics_optigest ( idTransics, idOptigest, dateCreation, user ) VALUES ( ?, ?, NOW( ) , ? )" );
					$response["success"] = $stmt->execute( array( $idTransics, $idOptigest, $_SESSION['ident'] ) );

					if( $response["success"] ) {
						$response["update"] = $stmt->rowCount();
					} else {
						$err = $stmt->errorInfo();
						$response["error"] = array( "reason"=>$err[2] );
					}
				break;
				
				case "read":
				case "load":
					break;
				
				case "update":
					break;
					
				
				case "delete":
				break;
				
				default;
				break;
			}
		} else {
			$response["success"] = false;
			$response["error"] = array( "reason"=>'Conducteur Invalide' );
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
<?php
/**
 * crudTypeATfunc.php
 */
function createTypeAT($dbConn) {
	$reqInsertTypeAT = "INSERT INTO t_type_at_tpa ( tpa_dateCrea, tpaUserCrea ) VALUES ( NOW(), ? )";
	$stmt = $dbConn->prepare( $reqInsertTypeAT );
	$rep = array( "success"=>$stmt->execute( array( isset( $_SESSION['ident'] ) ? $_SESSION['ident'] : '???' ) ) );
	
	if( $rep["success"] ) {
		$rep["result"] = $dbConn->lastInsertId();;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;
}

function readTypeAT($dbConn) {
	$reqSelectTypeAT = "SELECT IdTypeAt, tpa_libelle, tpa_code, tpa_duree, tpa_couleur, tpa_dateAnnule IS NULL AS tpa_valid FROM t_type_at_tpa ORDER BY IdTypeAt ASC";
	$stmt = $dbConn->prepare( $reqSelectTypeAT );
	$rep = array( "success"=>$stmt->execute( ) );
	
	if( $rep["success"] ) {
		$rep["result"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;
}

function codeTypeAT($dbConn) {

	$reqSelectCodeTypeAT = "SELECT DISTINCT tpa_code FROM t_type_at_tpa WHERE  TRIM( IFNULL( tpa_code, '' ) ) != '' ORDER BY tpa_code ASC";
	$stmt = $dbConn->prepare( $reqSelectCodeTypeAT );
	$rep = array( "success"=>$stmt->execute( ) );
	
	if( $rep["success"] ) {
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$rep["result"] = array();
		foreach ($result as &$codeAT) {
			$rep["result"][] = $codeAT["tpa_code"];
		}
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;
}

function updateTypeAT($dbConn, $ident, $libelle, $tpa_code, $tpa_duree, $tpa_couleur) {

	$reqUpdateTypeAT = "UPDATE t_type_at_tpa SET tpa_libelle = ?, tpa_code = ?, tpa_duree = ?, tpa_couleur = ? WHERE IdTypeAt = ? LIMIT 1";
	$stmt = $dbConn->prepare( $reqUpdateTypeAT );
	
	$rep = array( "success"=>$stmt->execute( array($libelle, $tpa_code, $tpa_duree, $tpa_couleur, $ident) ) );
	
	if( $rep["success"] ) {
		$rep["result"] = $dbConn->lastInsertId();;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;
}

function deleteTypeAT($dbConn, $ident) {
	$reqDeleteTypeAT = "UPDATE t_type_at_tpa SET tpa_dateAnnule = IF( tpa_dateAnnule IS NULL, NOW(), NULL ) WHERE IdTypeAt = ? LIMIT 1";
	$stmt = $dbConn->prepare( $reqDeleteTypeAT );
	
	$rep = array( "success"=>$stmt->execute( array($ident) ) );
	
	if( $rep["success"] ) {
		$rep["result"] = $dbConn->lastInsertId();;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;
}

?>
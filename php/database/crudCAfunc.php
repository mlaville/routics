<?php
/**
 * crudCAfunc.php
 */
 
function createCAMois( $dbConn, $mois, $tabValues ) {
	$reqInsertCAMois = "INSERT INTO t_ca_mensuel_cam"
		. " ( mois_cam, num_parc_cam, montant_cam, nb_jour_cam, km_cam, date_import_cam, user_import_cam )"
		. " VALUES ( ?, ?, ?, ?, ?, NOW(), ? )";
	$stmt = $dbConn->prepare( $reqInsertCAMois );
	
	$user = isset( $_SESSION['ident'] ) ? $_SESSION['ident'] : '???';
	$retour = array();
	foreach( $tabValues as $value ) {
		$val = (array)$value;
		$tabVal = array( $mois, $val['Code'], floatval($val['C.A.']) * 100, $val['J._Travaillés'], $val['Km'], $user );
		
		$rep = array( "success"=>$stmt->execute( $tabVal ) );
		$rep['value'] = $val;
		
		if( $rep["success"] ) {
			$rep["result"] = $dbConn->lastInsertId();
		} else {
			$err = $stmt->errorInfo();
			$rep["error"] = array( "reason"=>$err[2] );
		}
		
		$retour[] = $rep;
	}

	return $retour;
}
?>
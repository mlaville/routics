<?php
/**
 * dataCharts.php
 * 
 * @auteur     marc laville -polinux
 * @Copyleft 2015
 * @date      08/05/2015
 * @version    0.1
 * @revision   $0
 *
 * calcul de donnees  stat
 *
 * @todolist
 *
 * tables :
 * - t_km_parcourt
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

function chargeDataKm($dbConn, $vehicleTransicsId  ) {

	$stmt = $dbConn->prepare( "SELECT"
		. " DATE_FORMAT( BeginDate , '%Y-%m' ) AS mois, MAX( KmEnd) AS km"
		. " FROM t_km_parcourt"
		. " WHERE VehicleTransicsId = ?"
		. " GROUP BY DATE_FORMAT( BeginDate, '%Y%m' ) "
	);

	$rep = array( "success"=>$stmt->execute( array( $vehicleTransicsId ) ) );
	
	if( $rep["success"] ) {
		$rep["result"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}
		
	return $rep;	
}

?>
<?php
/*
*/
function statVehicle($dbConn, $tabParam) {
	$typeVehicule = isset( $tabParam["typeVehicule"] ) ? $tabParam["typeVehicule"] : '';
	$dateInf = isset($tabParam["dateInf"]) ? implode( '-', array_reverse( explode( '/', $tabParam["dateInf"] ) ) ) : "2013-04-01";
	$dateSup = isset($tabParam["dateSup"]) ? implode( '-', array_reverse( explode( '/', $tabParam["dateSup"] ) ) ) : "2013-04-30";
	$rupture = isset($tabParam["rupture"]) ? $tabParam["rupture"] : 'Filter';
	
	$sqlStatVehicle = "SELECT VehicleID, TransicsID, LicensePlate, Filter, CodeVehicule, {rupture} AS Rupture, NbVehicule, Kms, NbOr, TotCout, CoutKm"
		. " FROM ("
		. " SELECT VehicleID, VehicleTransicsID AS TransicsID, LicensePlate, Filter, VehicleID AS CodeVehicule, ChassisNumber,"
		. " COUNT(*) AS NbVehicule, SUM( km ) AS Kms, SUM( Nb ) AS NbOr,"
		. " ROUND( SUM( Cout ) /100, 2 ) AS TotCout, SUM( Cout ) / SUM( km ) /100 AS CoutKm"
		. " FROM ("
		. " SELECT t_vehicle.VehicleID AS VehicleID, t_vehicle.VehicleTransicsID, LicensePlate,"
		. " REPLACE( REPLACE( REPLACE( REPLACE( AutoFilter, '  ', ' '), 'TXMAX', '' ) , 'BOUQUEROD/', '' )  , '/', '' ) AS Filter, IFNULL(ChassisNumber, '') AS ChassisNumber,"
		. " MAX( KmEnd ) - MIN( KmBegin ) AS km"
		. " FROM t_vehicle"
		. " LEFT JOIN t_km_parcourt ON t_km_parcourt.VehicleTransicsId = t_vehicle.VehicleTransicsID"
		. " WHERE DATE( BeginDate ) BETWEEN ? AND ?"
		. " GROUP BY t_vehicle.VehicleTransicsID"
		. " )vehicule"
		. " LEFT JOIN ("
		. " SELECT or_TransicsVehicleId, or_idVehicle, SUM( or_montant ) AS Cout, COUNT( * ) AS Nb"
		. " FROM t_or"
		. " WHERE or_date_annule IS NULL"
		. " AND or_date BETWEEN ? AND ?"
		. " GROUP BY or_idVehicle"
		. " )OrdreReparation ON or_TransicsVehicleId = VehicleTransicsID"
		. " GROUP BY {rupture}, VehicleID"
		. " WITH ROLLUP) stat";

	$sqlStatTrailer = "SELECT VehicleID, TransicsID, LicensePlate, Filter, {rupture} AS Rupture, NbVehicule, Kms, NbOr, TotCout, CoutKm"
		. " FROM ("
		. " SELECT IdTrailer, TransicsID, LicensePlate, REPLACE( Filter, '  ', ' ') AS Filter, Trailer AS VehicleID, ChassisNumber,"
		. " COUNT(*) AS NbVehicule, SUM( km ) AS Kms, SUM( Nb ) AS NbOr,"
		. " ROUND( SUM( Cout ) / 100, 2 ) AS TotCout, SUM( Cout ) / SUM( km ) / 100 AS CoutKm"
		. " FROM ("
		. " SELECT t_trailer.ID AS IdTrailer, t_trailer.TransicsID, LicensePlate, Filter, IFNULL(ChassisNumber, '') AS ChassisNumber, Trailer, SUM( KmEnd - KmBegin ) AS km"
		. " FROM t_trailer"
		. " LEFT JOIN t_km_parcourt ON Trailer = t_trailer.ID"
		. " WHERE DATE( BeginDate ) BETWEEN ? AND ?"
		. " GROUP BY t_trailer.ID"
		. " )vehicule"
		. " LEFT JOIN ("
		. " SELECT or_idVehicle, SUM( or_montant ) AS Cout, COUNT( * ) AS Nb"
		. " FROM t_or"
		. " WHERE or_date_annule IS NULL AND or_date BETWEEN ? AND ?"
		. " GROUP BY or_idVehicle"
		. " )OrdreReparation ON or_idVehicle = IdTrailer"
		. " GROUP BY {rupture}, Trailer"
		. " WITH ROLLUP) stat";
	
	$sqlStat = ( $typeVehicule == 'remorque' ) ? $sqlStatTrailer : $sqlStatVehicle;
	$sqlStat = str_replace( '{rupture}', ( $rupture == 'transport' ) ? 'Filter' : 'ChassisNumber', $sqlStat );
	$stmt = $dbConn->prepare( $sqlStat );
	
//	if( $stmt->execute( array( $dateInf, $dateSup, $dateInf, $dateSup, $rupture ) ) ) {
	if( $stmt->execute( array( $dateInf, $dateSup, $dateInf, $dateSup ) ) ) {
		$response["result"] = $stmt->fetchAll( PDO::FETCH_ASSOC );
		
		$structResult = array();
		$groupResult = array();
		foreach( $response["result"] as $lgStat ) {
			if( $lgStat["VehicleID"] == null ) {
				unset( $lgStat["VehicleID"], $lgStat["LicensePlate"], $lgStat["CodeVehicule"], $lgStat["TransicsID"] );
				if( $lgStat["Rupture"] == null ) {	// derniere ligne
					unset( $lgStat["Rupture"] );
					$lgStat["tabVehicle"] = $structResult;
				} else {
					$lgStat["tabVehicle"] = $groupResult;
					$structResult[] = $lgStat;
					$groupResult = array();
				}
			} else {
				$groupResult[] = $lgStat;
			} 
		}
		$response["structResult"] = $lgStat;
	} else {
		$err = $stmt->errorInfo();
		$response["error"] = array( "reason"=>$err[2] );
		$response["sqlStat"] = $sqlStat;
	}
	
	return $response;
}
?>

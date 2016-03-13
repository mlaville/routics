<?php
/**
 * funcStatVehicles.php
 * 
 * @auteur     marc laville - polinux
 * @Copyleft 2015
 * @date       28/09/2015
 * @version    0.1
 * @revision   $0$
 *
 * @date revision   05/10/2015 marc laville : Commentaires
 * @date revision   24/01/2016 marc laville : Calcul des couts mensuels (loadCoutKmMensuel)
 * @date revision   07/02/2016 marc laville : Recupere le nb de jour travaillés par mois (loadConsoMensuel)
 * @date revision   07/03/2016 marc laville : Recupere les codes conducteur à partir de la table t_km_parcourt 
								lorsqu'il ne sont pas présent dans la table t_report_consom_csm
 *
 * Tables
 * - t_vehicle
 * - t_km_parcourt
 * - t_or
 * - t_autoroute_atr
 * - t_ca_mensuel_cam
 *
 * Calcul des statistiques de cout kilometrique
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
/**
 * Stat des Coût concernant les Ordres de Réparation
 */
function statVehicle($dbConn, $tabParam) {
	$typeVehicule = isset( $tabParam["typeVehicule"] ) ? $tabParam["typeVehicule"] : '';
	$dateInf = isset($tabParam["dateInf"]) ? implode( '-', array_reverse( explode( '/', $tabParam["dateInf"] ) ) ) : "2015-04-01";
	$dateSup = isset($tabParam["dateSup"]) ? implode( '-', array_reverse( explode( '/', $tabParam["dateSup"] ) ) ) : "2015-04-30";
	$rupture = isset($tabParam["rupture"]) ? $tabParam["rupture"] : 'Filter';
	
	$sqlStatVehicle = "SELECT VehicleID, TransicsID, LicensePlate, Filter, ChassisNumber, CodeVehicule, {rupture} AS Rupture, NbVehicule, Kms, NbOr, TotCout, CoutKm"
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
		. " ) OrdreReparation ON or_TransicsVehicleId = VehicleTransicsID"
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
	
	$response = array( "sqlStat" => $sqlStat );
	
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
	}
	
	return $response;
}

/*
 * Calcul du releve kilometrique mensuel
 */
function loadKmMensuel($dbConn, $mois) {

	$reqSelectKmMensuel = "SELECT"
		. " Vehicle, VehicleTransicsId, MIN( KmBegin ) AS KmDebut, MAX( KmEnd ) AS KmFin, MIN( BeginDate ) AS DateDebut, MAX( EndDate ) AS DateFin,"
		. " MAX( KmEnd ) - MIN( KmBegin ) AS Distance"
		. " FROM t_km_parcourt"
		. " WHERE KmBegin < KmEnd"
		. " AND DATE_Format( BeginDate, '%Y%m' ) = ?"
		. " GROUP BY VehicleTransicsId";
	
	$stmt = $dbConn->prepare( $reqSelectKmMensuel );
	$rep = array( "success"=>$stmt->execute( array( $mois ) ) );
	
	if( $rep["success"] ) {
		$rep["result"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
		$rep["reqSelectKmMensuel"] = $reqSelectKmMensuel;
	}

	return $rep;
}

/*
 * Selection du CA mensuel
 */
function loadCaMensuel($dbConn, $mois) {
//	SELECT `num_parc_cam`,`montant_cam` FROM `t_ca_mensuel` WHERE `mois_cam`= '201512' 
}

/*
 * Calcul du cout kilometrique mensuel
 */
function loadCoutKmMensuel($dbConn, $mois) {

	$reqSelectCoutKmMensuel = "SELECT Vehicle, VehicleTransicsId, KmDebut, KmFin, Distance, NbJours, CoutOR, NbOR, BeginDate, montant_cam,"
 		. " SUM(art_montant) AS MontantAutoroute, SUM(art_km) AS KmAutoroute, idTransicsDrivers"
 		. " FROM (SELECT"
 		. " Vehicle, parc.VehicleTransicsId, KmDebut, KmFin, Distance, NbJours, CoutOR, NbOR, BeginDate, montant_cam, idTransicsDrivers"
 		. " FROM (SELECT"
		. " Vehicle, VehicleTransicsId, KmDebut, KmFin, Distance, NbJours, CoutOR, NbOR, BeginDate, idTransicsDrivers"
		. " FROM ("
		. " SELECT Vehicle, VehicleTransicsId, KmDebut, KmFin, Distance, sum(NbJours) AS NbJours, BeginDate,"
		. " GROUP_CONCAT( CONCAT(DriverTransicsId, '-', NbJours) ) AS idTransicsDrivers"
		. " FROM (SELECT Vehicle, VehicleTransicsId, MIN( KmBegin ) AS KmDebut, MAX( KmEnd ) AS KmFin, MAX( KmEnd ) - MIN( KmBegin ) AS Distance,"
		. " COUNT( DISTINCT DATE(BeginDate) ) AS NbJours, BeginDate, DriverTransicsId"
		. " FROM t_km_parcourt WHERE KmBegin < KmEnd AND DATE_Format( BeginDate, '%Y%m' ) = ?" 
		. " GROUP BY VehicleTransicsId, DriverTransicsId) pass1"
		. " GROUP BY VehicleTransicsId"
		. " ) vehicule"
		. " LEFT JOIN ("
		. " SELECT or_TransicsVehicleId, or_idVehicle, SUM( or_montant ) AS CoutOR, COUNT( * ) AS NbOR"
		. " FROM t_or"
		. " WHERE or_date_annule IS NULL"
		. " AND DATE_Format( or_date, '%Y%m' ) = ?"
		. " GROUP BY or_idVehicle"
		. " ) OrdreReparation ON or_TransicsVehicleId = VehicleTransicsID"
		. " ) parc "
		. " LEFT JOIN t_ca_mensuel_cam ON num_parc_cam = Vehicle AND mois_cam = DATE_Format( BeginDate, '%Y%m' )"
		. " ) parc"
		. " LEFT JOIN  t_autoroute_atr ON atr_numParc = Vehicle AND DATE_Format( atr_dtSortie, '%Y%m' ) = DATE_Format( BeginDate, '%Y%m' )"
		. " GROUP BY VehicleTransicsId";
	
	$stmt = $dbConn->prepare( $reqSelectCoutKmMensuel );
	$rep = array( "success"=>$stmt->execute( array( $mois, $mois ) ) );
	
	if( $rep["success"] ) {
		$rep["result"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
		$rep["reqSelectCoutKmMensuel"] = $reqSelectCoutKmMensuel;
	}

	return $rep;
}
/*
 * Calcul du cout kilometrique mensuel
 */
function loadConsoMensuel($dbConn, $mois) {

	$reqSelectConsoMensuel = "SELECT"
		. " DriverTransicsId, VehicleTransicsId, VehicleID, VehicleImmat, cms_date,"
		. " SUM(Distance) AS KmParcourus, SUM(Consumption_Total) AS TotalConso, SUM( Duration_Driving ) AS DureeConduite,"
		. " COUNT( DISTINCT cms_date ) AS NbJours"
		. " FROM t_report_consom_csm"
		. " WHERE DATE_FORMAT(cms_date,'%Y%m')=?"
		. " GROUP BY VehicleTransicsId, DriverTransicsId";
	
	$stmt = $dbConn->prepare( $reqSelectConsoMensuel );
	$rep = array( "success"=>$stmt->execute( array( $mois ) ) );
	
	if( $rep["success"] ) {
		$rep["result"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;
}

?>
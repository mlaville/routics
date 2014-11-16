<?php
/**
 * crudRecap.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013-2014
 * @date      21/10/2013
 * @version    0.6
 * @revision   $5
 *
 * @date revision 29/05/2014 Tableau des Heures Dues
 * @date revision 07/06/2014 Calcul la colonne réseve à partir de la table des heures dues (t_heure_du_hdu)
 * @date revision 19/06/2014 Gestion de la Rubrique Ajustement
 * @date revision 08/09/2014 Debug du Calcul de la réserve (requete SQL)
 * @date revision 05/11/2014 Correctiondu calcul des reports des heures dues d'un mois sur l'autre
 *
 * crud des récapitulatifs mensuels d'activite conducteur et Heures Dues
 *
 * @todolist
 * - "Nettoyer" les rubriques obsolètes
 * - Gestion des erreurs
 *
 * tables :
 * - t_ts_service_tsm
 * - t_heure_du_hdu
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

function enregistreRecap($dbConn, $at_date, $tabData, $user) {
	$stmt = $dbConn->prepare( "REPLACE INTO t_ts_service_tsm"
					. " ( tsm_date, PersonTransicsID, tsm_conduiteDisque, tsm_totalDisque, tsm_taReel, tsm_taReelModif, tsm_modifDisque, tsm__user, tsm_date_crea ) "
					. " VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, NOW() )");
					
	foreach( $tabData as &$actiDriver ) {
		$rep = array(
			"success"=>$stmt->execute( array( $at_date,
										$actiDriver['idTransics'],
										$actiDriver['conduiteDisque'],
										$actiDriver['totalDisque'],
										$actiDriver['taReel'],
										$actiDriver['taReelModif'],
										$actiDriver['modifDisque'],
										$user 
									) )
		);
		
		if( $rep["success"] ) {
		} else {
			$err = $stmt->errorInfo();
			$rep["error"] = array( "reason"=>$err[2] );
		}
	}
	
	return $rep;	
}


function enregistreHeuresDues($dbConn, $at_date, $tabData, $user) {
	$stmt = $dbConn->prepare( "REPLACE INTO t_heure_du_hdu ("
					. " hdu_date, PersonTransicsID, hdu_soldeHrPrec1, hdu_soldeHrPrec2, hdu_soldeMtPrec1, hdu_soldeMtPrec2,"
					. " hdu_pxHr1, hdu_pxHr2,"
					. " hdu_duEntreprise1, hdu_duEntreprise2," // Obsolete
					. " hdu_duEntrepriseAjust,"
					. " hdu_duConductHr1, hdu_duConductHr2, hdu_duConductMt1, hdu_primeA,"
					. " hdu_primeA1, hdu_primeB, hdu_primeB1, hdu_primeC,"
					. " hdu_user, hdu_dateCrea"
					. " ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW() )"
				);

				
	$rep= array();
	foreach( $tabData as &$hrDuDriver ) {
		/*
		 * Les parametres sont passés encodée en une chaine json_decode
		 */
		$dataHrDues = json_decode($hrDuDriver['param']);
		$result = $stmt->execute( array( $at_date,
										$hrDuDriver['idTransics'],
										$dataHrDues->soldeHrPrec1,
										$dataHrDues->soldeHrPrec2,
										$dataHrDues->soldeMtPrec1,
										$dataHrDues->soldeMtPrec2,
										$dataHrDues->pxHrDisque1,
										$dataHrDues->pxHrDisque2,
										$dataHrDues->duEntreprise1,
										$dataHrDues->duEntreprise2,
										$dataHrDues->duEntrepriseAjust,
										$dataHrDues->duConductHr1,
										$dataHrDues->duConductHr2,
										$dataHrDues->duConductMt1,
										$dataHrDues->duConductMt2,
										$dataHrDues->primeA1,
										$dataHrDues->primeA2,
										$dataHrDues->primeB1,
										$dataHrDues->primeB2,
										$user
									) );
		
		if( !$result ) {
			$err = $stmt->errorInfo();
		}
		
		$rep[] = array( "success"=>$result,
						"error"=>( $result ? null : array( "reason"=>$err[2], "data"=>json_encode($tabData) ) )
					);
	}
	
	return $rep;	
}


function chargeRecap($dbConn, $at_date ) {

	$stmt = $dbConn->prepare( "SELECT"
		. " t_ts_service_tsm.PersonTransicsID, tsm_conduiteDisque, tsm_totalDisque, tsm_taReel, tsm_taReelModif, tsm_modifDisque,"
		. " 0 AS hdu_soldeHrPrec1,"
		. " IFNULL( hd.hdu_soldeHrPrec2,"
		. " ( ( hd_prec.hdu_soldeHrPrec2 + hd_prec.hdu_duEntreprise2 - hd_prec.hdu_duConductHr2 ) * hd_prec.hdu_pxHr2"
//		. " - hd_prec.hdu_primeA - hd_prec.hdu_primeB - hd_prec.hdu_primeC ) / hd_prec.hdu_pxHr2 ) AS hdu_soldeHrPrec2,"
		. " - hd_prec.hdu_primeB - hd_prec.hdu_primeC ) / hd_prec.hdu_pxHr2 + hd_prec.hdu_duEntrepriseAjust) AS hdu_soldeHrPrec2,"
		. " IFNULL( hd.hdu_pxHr1, hd_prec.hdu_pxHr1 ) AS hdu_pxHr1,"
		. " IFNULL( hd.hdu_pxHr2, hd_prec.hdu_pxHr2 ) AS hdu_pxHr2,"
		. " hd.hdu_duEntreprise1, hd.hdu_duEntreprise2,"
		. " hd.hdu_duEntrepriseAjust,"
		. " hd.hdu_duConductHr1, hd.hdu_duConductHr2, hd.hdu_duConductMt1, hd.hdu_primeA,"
		. " hd.hdu_primeA1, hd.hdu_primeB, hd.hdu_primeB1, hd.hdu_primeC"
		. " FROM t_ts_service_tsm"
		. " LEFT JOIN t_heure_du_hdu hd ON t_ts_service_tsm.PersonTransicsID = hd.PersonTransicsID"
		. " AND tsm_date = hd.hdu_date"
		. " LEFT JOIN t_heure_du_hdu hd_prec ON t_ts_service_tsm.PersonTransicsID = hd_prec.PersonTransicsID"
		. " AND hd_prec.hdu_date = LEFT( DATE_SUB( CONCAT( tsm_date, '-10' ) , INTERVAL '1' MONTH ) , 7 )"
		. " WHERE tsm_date = ?" );

	$rep = array( "success"=>$stmt->execute( array( $at_date ) ) );
	
	if( $rep["success"] ) {
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$tabDrivers = array();
		foreach ($result as &$drivers) {
			$tabDrivers[ intval($drivers["PersonTransicsID"]) ] = array('conduiteDisque'=>$drivers["tsm_conduiteDisque"],
																		'totalDisque'=>$drivers["tsm_totalDisque"],
																		'taReel'=>$drivers["tsm_taReel"],
																		'taReelModif'=>$drivers["tsm_taReelModif"],
																		'modifDisque'=>$drivers["tsm_modifDisque"],
																		'soldeHrPrec1'=>$drivers["hdu_soldeHrPrec1"],
																		'soldeHrPrec2'=>$drivers["hdu_soldeHrPrec2"],
																		'pxHr1'=>$drivers["hdu_pxHr1"],
																		'pxHr2'=>$drivers["hdu_pxHr2"],
																		'duEntreprise1'=>$drivers["hdu_duEntreprise1"],
																		'duEntreprise2'=>$drivers["hdu_duEntreprise2"],
																		'duEntrepriseAjust'=>$drivers["hdu_duEntrepriseAjust"],
																		'duConductHr1'=>$drivers["hdu_duConductHr1"],
																		'duConductHr2'=>$drivers["hdu_duConductHr2"],
																		'duConductMt1'=>$drivers["hdu_duConductMt1"],
																		'duConductMt2'=>$drivers["hdu_primeA"],
																		'primeA1'=>$drivers["hdu_primeA1"],
																		'primeA2'=>floatval($drivers["hdu_primeB"]),
																		'primeB1'=>$drivers["hdu_primeB1"],
																		'primeB2'=>floatval($drivers["hdu_primeC"])
																		);
		}
		$rep["result"] = $tabDrivers;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}
		
	return $rep;	
}

function chargeReserve($dbConn) {

	$stmt = $dbConn->prepare( "SELECT"
		. " PersonTransicsID,"
		. " hdu_soldeHrPrec2 + hdu_duEntreprise2 + hdu_duEntrepriseAjust - hdu_duConductHr2 - ( hdu_primeB + hdu_primeC ) / hdu_pxHr2 AS reserve"
		. " FROM t_heure_du_hdu"
		. " WHERE hdu_date = (SELECT MAX( hdu_date ) FROM t_heure_du_hdu )" );

	$rep = array( "success"=>$stmt->execute(  array() ) );
	
	if( $rep["success"] ) {
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$tabDrivers = array();
		foreach ($result as &$drivers) {
			$tabDrivers[ intval($drivers["PersonTransicsID"]) ] = floatval($drivers["reserve"]);
		}
		$rep["result"] = $tabDrivers;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}
		
	return $rep;	
}

?>
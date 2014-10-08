<?php
/**
 * crudHrDues.php
 * 
 * @auteur     marc laville
 * @Copyleft 2014
 * @date      17/05/2014
 * @version    0.2
 * @revision   $0$
 *
 * @date revision 27/05/2014 Remplace la table des parametres par une chaine json
 *
 * crud des heures dues conducteur
 * - A Faire : Gestion des erreurs
 *
 * tables : 
 * - t_heure_du_hdu
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

function enregistreHeuresDues($dbConn, $at_date, $tabData, $user) {
	$stmt = $dbConn->prepare( "REPLACE INTO t_heure_du_hdu ("
					. " hdu_date, PersonTransicsID, hdu_soldeHrPrec1, hdu_soldeHrPrec2, hdu_soldeMtPrec1, hdu_soldeMtPrec2,"
					. " hdu_pxHr1, hdu_pxHr2, hdu_duEntreprise1, hdu_duEntreprise2,"
					. " hdu_duConductHr1, hdu_duConductHr2, hdu_duConductMt1, hdu_duConductMt2,"
					. " hdu_primeA1, hdu_primeA2, hdu_primeB1, hdu_primeB2,"
					. " hdu_user, hdu_dateCrea"
					. " ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW() )"
				);

				
	foreach( $tabData as &$hrDuDriver ) {
		/*
		 * Les parametres sont passés encodée en une chaine json_decode
		 */
		$dataHrDues = json_decode($hrDuDriver['param']);
		$rep = array(
			"success"=>$stmt->execute( array( $at_date,
										$hrDuDriver['idTransics'],
										$dataHrDues->soldeHrPrec1,
										$dataHrDues->soldeHrPrec2,
										$dataHrDues->soldeMtPrec1,
										$dataHrDues->soldeMtPrec2,
										$dataHrDues->pxHrDisque1,
										$dataHrDues->pxHrDisque2,
										$dataHrDues->duEntreprise1,
										$dataHrDues->duEntreprise2,
										$dataHrDues->duConductHr1,
										$dataHrDues->duConductHr2,
										$dataHrDues->duConductMt1,
										$dataHrDues->duConductMt2,
										$dataHrDues->primeA1,
										$dataHrDues->primeA2,
										$dataHrDues->primeB1,
										$dataHrDues->primeB2,
										$user
									) )
		);
		
		if( $rep["success"] ) {
		} else {
			$err = $stmt->errorInfo();
			$rep["error"] = array( "reason"=>$err[2], "data"=>json_encode($tabData) );
		}
	}
	
	return $rep;	
}

function chargeHeuresDues($dbConn, $at_date ) {
	$stmt = $dbConn->prepare( "SELECT PersonTransicsID, tsm_conduiteDisque, tsm_totalDisque, tsm_taReel, tsm_taReelModif, tsm_modifDisque"
							. " FROM t_ts_service_tsm WHERE tsm_date = ?");
							
	$rep = array( "success"=>$stmt->execute( array( $at_date ) ) );
	if( $rep["success"] ) {
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$tabDrivers = array();
		foreach ($result as &$drivers) {
			$tabDrivers[ intval($drivers["PersonTransicsID"]) ] = array('conduiteDisque'=>$drivers["tsm_conduiteDisque"],
																		'totalDisque'=>$drivers["tsm_totalDisque"],
																		'taReel'=>$drivers["tsm_taReel"],
																		'taReelModif'=>$drivers["tsm_taReelModif"],
																		'modifDisque'=>$drivers["tsm_modifDisque"]
																		);
		}
		$rep["result"] = $tabDrivers;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}
		
	return $rep;	
}
?>
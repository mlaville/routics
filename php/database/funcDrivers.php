<?php
/**
 * funcDrivers.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
 * @date       26/06/2013
 * @version    0.1.0
 * @revision   $0$
 *
 * @date revision 27/01/2014 gestion du code Optigest
 * @date revision 15/02/2014 passe du quota par défaut (190 heures) en paramètre
 * @date revision 20/04/2014 remonte le code AT  dans  loadATDriver
 *
 * Acces aux données conducteur stockées en base MySql
 * Tables : 
 * - t_driver
 * - tj_transics_optigest
 * - t_arret_travail_at
 * - t_type_at_tpa
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/* Chargement des Quotas de temps de travail par conducteur */
/* Affectation du code optigesr par la jointure */
function loadQuotaDriver($dbConn, $tmpsServDefault) {

	$reqSelectQuota = "("
			. " SELECT PersonTransicsID AS idTransics, drv_tmp_serv_mois, drv_tmp_reserve, drv_color, drv_bgcolor, idOptigest"
			. " FROM t_driver"
			. " LEFT JOIN tj_transics_optigest ON idTransics = PersonTransicsID"
			. " ) UNION ("
			. " SELECT idTransics, IFNULL(drv_tmp_serv_mois, ?) AS drv_tmp_serv_mois, drv_tmp_reserve, drv_color, drv_bgcolor, idOptigest"
			. " FROM t_driver"
			. " RIGHT JOIN tj_transics_optigest ON idTransics = PersonTransicsID"
			. " )";

	$stmt = $dbConn->prepare( $reqSelectQuota );
	$rep = array( "success"=>$stmt->execute( array($tmpsServDefault) ) );
	
	if( $rep["success"] ) {
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$tabDrivers = array();
		foreach ($result as &$drivers) {
			$tabDrivers[ intval($drivers["idTransics"]) ] = array(
																	'maxTmpsServise'=>$drivers["drv_tmp_serv_mois"],
																	'reserve'=>$drivers["drv_tmp_reserve"],
																	'color'=>$drivers["drv_color"],
																	'bgcolor'=>$drivers["drv_bgcolor"],
																	'idOptigest'=>$drivers["idOptigest"]
																);
		}
		$rep["result"] = $tabDrivers;
	} else {
		$err = $stmt->errorInfo();
		$rep["error"] = array( "reason"=>$err[2] );
	}

	return $rep;
}

/* Chargement des Arrets de Travail */
function loadATDriver( $dbConn, $annee, $mois ) {
	$reqSelectAT = "SELECT at_PersonTransicsID, DATE_FORMAT( at_date, '%d' ) AS jourAT, at_duree, tpa_libelle, tpa_couleur, tpa_code"
			. " FROM t_arret_travail_at, t_type_at_tpa"
			. " WHERE at_type_fk = IdTypeAt AND at_date BETWEEN ? AND ?";
			
	$stmt = $dbConn->prepare( $reqSelectAT );
	$rep = array( "success"=>$stmt->execute( array( $annee . '-' . $mois . '-01', $annee . '-' . $mois . '-31') ) );
	
	if( $rep["success"] ) {
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$tabDrivers = array();
		foreach ($result as &$atDrivers) {
			$idDriver = intval($atDrivers["at_PersonTransicsID"]);
			$jour = $atDrivers["jourAT"];
			if(!isset( $tabDrivers[ $idDriver ] ) ) {
				$tabDrivers[ $idDriver ] = array();
			}
			$tabDrivers[ $idDriver ][intval($jour)] = array(
										'duree' => intval($atDrivers["at_duree"]),
										'code' => $atDrivers["tpa_code"],
										'libelle' => $atDrivers["tpa_libelle"],
										'couleur' => $atDrivers["tpa_couleur"] 
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
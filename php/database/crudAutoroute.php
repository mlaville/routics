<?php
/**
 * crudAutoroute.php
 *
 * @auteur     marc laville
 * @Copyleft 2016
 * @date       23/01/2016
 * @version    0.1
 * @revision   $0$
 * 
 * @date revision xx/xx/xxxx zzzzzz
 *
 * Enregistrement des rapports d'autoroute
 */
 
function createRapAutoroute( $dbConn, $tabValues ) {

	$reqInsertRapAutoroute = "INSERT INTO t_autoroute_atr"
		. " ( atr_badge, atr_societe, atr_numParc, atr_immat, atr_dtEntree, atr_nomEntree, atr_dtSortie, atr_nomSortie, art_montant, art_km, art_dateImport, atr_user_import )"
		. " VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ? )";
	$stmt = $dbConn->prepare( $reqInsertRapAutoroute );
	
	$user = isset( $_SESSION['ident'] ) ? $_SESSION['ident'] : '???';
	$retour = array();
	foreach( $tabValues as $value ) {
		$val = (array)$value;
//		{"badge":"315649000032200226\/6","Immatriculation":"AA123CX","Parc":"74","Societe":"A404","DateEntree":"2015-07-21  11:20","DateSortie":"2015-07-21  12:09","Kilometres":"43,8","TotalHT":"12,83546748"},

		$tabVal = array(
			$val['badge'],
			$val['societe'],
			$val['Parc'],
			$val['Immatriculation'],
			$val['DateEntree'],
			$val['entree'],
			$val['DateSortie'],
			$val['sortie'],
			str_replace(",", ".", $val['TotalHT']),
			$val['Kilometres'],
			$user );
		
		$rep = array( "success"=>$stmt->execute( $tabVal ) );
		$rep['value'] = $val;
		
		if( $rep["success"] ) {
			$rep["result"] = $dbConn->lastInsertId();
		} else {
			$err = $stmt->errorInfo();
			$rep["error"] = array( "reason"=>$err[2] );
		}
		
		$retour[] = $rep;
				/*$retour[] = $tabVal;*/
	}

	return $retour;
}
?>
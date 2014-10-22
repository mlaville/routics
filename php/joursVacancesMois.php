<?php
/**
 * joursVacancesMois.php
 * 
 * @auteur     marc laville
 * @Copyleft 2014
 * @date       28/06/2014
 * @version    0.5
 * @revision   $0$
 *
 * Construction de la liste des jours de vacances pour un mois donné
 *
 * A faire :
 * Gestion des Zones (A B C)
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 
/*
function intersectPlageMois( $item, $unMois ) {

	date_default_timezone_set('Europe/Paris');

	$date01 = DateTime::createFromFormat('Ym-d', $unMois . '-01');
	$dateDerJour = DateTime::createFromFormat('Ym-d', strval( intval($unMois) + 1 ) . '-00');
	$dateDebut = DateTime::createFromFormat( 'Ymd', $item->DTSTART );
	$dateFin = DateTime::createFromFormat( 'Ymd', $item->DTEND );
	$result = array();
	
	if( $dateFin >= $date01 && $dateDebut <= $dateDerJour ) {
		for( $dateMin = ( $date01 > $dateDebut ) ? $date01 : $dateDebut,
			 $dateMax = ( $dateDerJour > $dateFin ) ? $dateFin : $dateDerJour,
			 $dateInterval = new DateInterval('P1D') ;
			 $dateMin <= $dateMax ;
			 $dateMin->add($dateInterval) ) {
				$result[] = intval( $dateMin->format('d') );
		}
	}

	return $result;
}

function listJoursVacances( $unMois ) {
	$listPlages = json_decode( file_get_contents("http://lib.polinux.fr/php/buildPlageVacances.php") );

	$listJour = array();

	foreach ($listPlages as &$plage) {
		$listJour = array_merge($listJour, intersectPlageMois( $plage, $unMois ));
	}
	
	return $listJour;
}

*/

 $client = new SoapClient("http://ws.polinux.fr/dvs/wsdl/datesVacances.wsdl");
  
  try {
//	$rep = $client->getDatesVacances( isset($_POST["mois"]) ? $_POST["mois"] : "201407" );
	$rep = $client->getDatesVacancesBasic( isset($_POST["mois"]) ? $_POST["mois"] : "201407", "B", 'test@bouquerodpierre.fr' );
  }
  
  catch (SoapFault $exception) {
    echo $exception;
  }

// return response to client
header("Content-Type: application/json");
echo json_encode( $rep );
?>
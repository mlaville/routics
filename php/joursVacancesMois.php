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
 
 $client = new SoapClient("http://ws.polinux.fr/dvs/wsdl/datesVacances.wsdl");
  
  try {
//	$rep = $client->getDatesVacances( isset($_POST["mois"]) ? $_POST["mois"] : "201407" );
	$response = $client->getDatesVacancesBasic(
		isset($_POST["mois"]) ? $_POST["mois"] : "201614",
		isset($_POST["zone"]) ? $_POST["zone"] : "A",
		'test@bouquerodpierre.fr'
	);
  }
  
  catch (SoapFault $exception) {
    echo $exception;
  }
  
/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
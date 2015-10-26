<?php
/*
 * funcActiDrivers.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       10/11/3013
 * @version    0.5
 * @revision   $0
 *
 * Calcul des relevés d'activite
 *
 * appel SOAP :
 * - Get_ActivityReport
 *
 * A faire : filtre sur Activity
                   <Activity>
                     <ID>26</ID>
                     <Name>Arrêt Travail</Name>
                     <IsPlanning xsi:nil="true"/>
                     <ActivityType>ACTIVITY</ActivityType>
                  </Activity>

 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 
function odbActivityDriver($clientSoap, $login, $uneDateInf, $uneDateSup, $Drivers) {

	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDateInf;
	$DateTimeRange->EndDate = $uneDateSup;

	/* Create selection object */
	$ActivityReportSelection = new stdClass();
	$ActivityReportSelection->DateTimeRangeSelection = $DateTimeRange;

	$ActivityReportSelection->Drivers = array($Drivers);
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ActivityReportSelection=$ActivityReportSelection;

	/* Call the webservice */
	set_time_limit ( 120 );
	try {
		$resultActi = $clientSoap->Get_ActivityReport($sender);
	} catch (Exception $e) {
		$resultActi = array('erreur'=>$e->getMessage());
	}
	return $resultActi;
}

function getActiDriver( $clientSoap, $login, $dateRef, $Drivers ) {
	date_default_timezone_set('Europe/Paris');

	$dateMini = new DateTime($dateRef . "T00:00:00+00:00");
	$dateMaxi = new DateTime($dateRef . "T00:00:00+00:00");
	$dateMaxi->add(new DateInterval('P1D'));
	
	$resultActivite = odbActivityDriver( $clientSoap, $login, $dateMini->format('c'), $dateMaxi->format('c'), $Drivers );

	$ActivityReportItems = $resultActivite->Get_ActivityReportResult->ActivityReportItems;
	$arrActivite = isset( $ActivityReportItems->ActivityReportItem ) ? $ActivityReportItems->ActivityReportItem : array();
	if( !is_array($arrActivite) ) {
		$arrActivite = array($arrActivite);
	}

	$tabActi = array( );
	$synthese = array( );
	foreach( $arrActivite as $activite ) {
		$dtDeb = new DateTime($activite->BeginDate);
		$dtFin = new DateTime($activite->EndDate);
		$dt1 = ($dtFin < $dateMaxi) ? $dtFin : $dateMaxi;
		$dt0 = ($dtDeb > $dateMini) ? $dtDeb : $dateMini;
		$duree = $dt1->getTimestamp() - $dt0->getTimestamp();
		$WorkingCode = $activite->WorkingCode->Code;
		
		$tabActi[] = array( $activite->ID,
								$activite->Driver->ID,
								$activite->Driver->TransicsID,
								$activite->WorkingCode->Code, 
								$activite->WorkingCode->Description, 
								$activite->Activity->ID, 
								$activite->Activity->Name, 
								$activite->BeginDate, 
								$activite->EndDate,
								$duree
							);
		if( !array_key_exists($WorkingCode, $synthese) ) {
			$synthese[$WorkingCode] = $duree;
		} else {
			$synthese[$WorkingCode] += $duree;
		}
		
	}

	return array('activites'=>$tabActi, 'synthese'=>$synthese );
}

function getActiDriverPeriode( $unWsdl, $login, $idTransicsDrivers, $dateInf, $dateSup ) {
	$tabActi = array();
	
	set_time_limit ( 120 );
	/* Create Soap client */
	$context = stream_context_create( array(
         'http' => array(
           'protocol_version'=> '1.0' ,
           'header'=> 'Content-Type: text/xml;' ,
         ),
    ));

	$options = array( 
		'stream_context' => $context,
		'soap_version'=>SOAP_1_2, 
		'exceptions'=>true, 
		'trace'=>1, 
		'cache_wsdl'=>WSDL_CACHE_BOTH 
	); 
	try {
		$clientSoap = new SoapClient($unWsdl, $options);
	} catch (Exception $e) {
		echo 'Exception reçue : ',  $e->getMessage(), "\n";
	}

	/* Create Drivers object */
	$Drivers = null;
	if( $idTransicsDrivers != null ) {
		$Drivers = new stdClass();
		$Drivers->IdentifierType = 'TRANSICS_ID';
		$Drivers->Id = $idTransicsDrivers;
	}

//	$ti = new DateInterval('P1D');

//	for( $dateCour = $dateInf ; $dateCour <= $dateSup ; $dateCour->add($ti) ) {
	for( $dateCour = $dateInf ; $dateCour <= $dateSup ; date_add($dateCour, date_interval_create_from_date_string('1 days')) ) {
		$actiDriver = getActiDriver( $clientSoap, $login, $dateCour->format('Y-m-d'), $Drivers );
		$tabActi[ $dateCour->format('Y-m-d') ] = $actiDriver['synthese'];
	};
	
	return $tabActi;
}

/**
 * Consommation
 */
function soapGetConsumptionReport( $soapClient, $login, $idTransicsDrivers, $mois ){

	/* effectue la sélection */
	$Drivers = new stdClass();
	$Drivers->IdentifierType = 'TRANSICS_ID';
	$Drivers->Id = $idTransicsDrivers;
	
	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDateInf;
	$DateTimeRange->EndDate = $uneDateSup;

	/* Create selection object */
	$ConsumptionReportSelection = new stdClass();
	$ConsumptionReportSelection->DateTimeRangeSelection = $DateTimeRange;

	$ConsumptionReportSelection->Drivers = array($Drivers);
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ConsumptionReportSelection = $ConsumptionReportSelection;
	
	/* Call the webservice */
	$get_ConsumptionReport = $soapClient->Get_ConsumptionReport($sender);
	
	return array( 
		'executiontime'=>$get_ConsumptionReport->Get_Vehicles_V7Result->Executiontime,
		'result'=>$get_ConsumptionReport->Get_Vehicles_V7Result->Vehicles->InterfaceVehicleResult_V7
	);
}

?>
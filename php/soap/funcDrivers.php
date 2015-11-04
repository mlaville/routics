<?php
/**
 * funcDrivers.php
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       25/10/2013
 * @version    0.5
 * @revision   $0$
 *
 * Fonctions d'acces aux données conducteur par les Webservice
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include 'configSoap.inc.php';

// Liste des conducteurs
function soapGetDrivers( $unWsdl, $login, $unIdTransics = null ){
	set_time_limit ( 300 );
	
	/* Create Soap client */
//	$clientSoap = null;
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
		'cache_wsdl'=> WSDL_CACHE_BOTH 
	); 
	try {
		$clientSoap = new SoapClient($unWsdl, $options);
	} catch (Exception $e) {
		echo 'Exception reçue : ',  $e->getMessage(), "\n";
	}
	
	if( !isset($clientSoap) ){
		echo 'Exception clientSoap\n';
	}
	$DriverSelection = new stdClass();
	$DriverSelection->ExcludeInactiveDrivers = true;
	
	/* Create selection object */
	if( !is_null($unIdTransics) ) {
		$Drivers = new stdClass();
		$Drivers->IdentifierType = 'TRANSICS_ID';
		$Drivers->Id = $unIdTransics;

		$DriverSelection->Persons = array($Drivers);
	}
	
	$DriverSelection->IncludeContactInfo = true;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->DriverSelection = $DriverSelection;

	/* Call the webservice */
	return $clientSoap->Get_Drivers_V6($sender);
}

/*
 * Fonctions de tri ( sur PersonExternalCode)
 */
function cmp($a, $b) {
    return strcmp( $a->PersonExternalCode, $b->PersonExternalCode );
}

/*
 * Liste Triée
 */
function listDrivers( $unWsdl, $login ){

	$retour = array( 'error'=>null, 'result'=>null );

	$resultDrivers = soapGetDrivers( $unWsdl, $login );
	$erreurs = $resultDrivers->Get_Drivers_V6Result->Errors;

	$retour['succes'] = !isset($erreurs->Error);

	if( $retour['succes'] ) {
		$result = $resultDrivers->Get_Drivers_V6Result->Persons->InterfacePersonResult_V6;
		usort( $result, "cmp" );
		$retour['result'] = $result;
	} else {
		$retour['error'] = $erreurs->Error;
	}

	return $retour;
}
/*
 * Construction des parametres à transmettre au service
 */
function soapInitSenderServiceTimesTachoDetail( $login, $dateDeb, $dateFin ) {
	
	$DateTimeRangeSelection = new stdClass();
	$DateTimeRangeSelection->StartDate = $dateDeb;
	$DateTimeRangeSelection->EndDate = $dateFin;

	/* Create selection object */
	$ServiceTimesSelection = new stdClass( );
	$ServiceTimesSelection->DateTimeRangeSelection = $DateTimeRangeSelection;

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ServiceTimesSelection = $ServiceTimesSelection;
	
	return $sender;
}

function tServiceMois($soapResult) {

	$erreur = array();
	$ttMois = array();
	$today = date("Y-m-d");
	
	foreach( $soapResult as &$detailTT ) {
		if( isset($detailTT->BeginDate) ) {
			$BeginDate = $detailTT->BeginDate;
			$EndDate = date_create( $detailTT->EndDate );
			if( date_format( $EndDate, "Y-m-d" ) != $today ) {
				$duree = strtotime( $detailTT->EndDate ) - strtotime( $BeginDate );
				$intJour = intval( date_format( date_create( $BeginDate ), "d") );
				
				if( !isset( $ttMois[$intJour] ) ) {
					$ttMois[$intJour] = array();
				}
				$dureeCourante = isset( $ttMois[$intJour][$detailTT->WorkingCode->Code] ) ? $ttMois[$intJour][$detailTT->WorkingCode->Code] : 0;
				$ttMois[$intJour][$detailTT->WorkingCode->Code] = $dureeCourante + max($duree, 0);
			}
		} else {
			$erreur[] = $detailTT;
		}
	}
			
	return $ttMois;
}

function getServiceTachyDriver( $clientSoap, $sender, $dateRef ) {

	$sender->ServiceTimesSelection->DateTimeRangeSelection->StartDate =	 $dateRef . "T00:00:00";
	$sender->ServiceTimesSelection->DateTimeRangeSelection->EndDate =	 $dateRef . "T23:59:59";
	$sender->ServiceTimesSelection->DateTimeRangeSelection->DateTypeSelection = 'STARTED';
//print_r($sender);
	set_time_limit ( 120 );
	try {
		$resultTT = $clientSoap->Get_ServiceTimesTachoDetail_V5($sender);
	} catch (Exception $e) {
		$resultTT = null;
//	    echo 'Exception reçue : ',  $e->getMessage(), "\n";
		$retour = array('erreur'=>$e->getMessage());
	}

	if( !is_null($resultTT) ) {
		$erreurs = $resultTT->Get_ServiceTimesTachoDetail_V5Result->Errors;
		
		if( !isset($erreurs->Error) ) {
			$ServiceTimes = $resultTT->Get_ServiceTimesTachoDetail_V5Result->ServiceTimes;
			$retour = (isset( $ServiceTimes->ServiceTimeTachoDetail )) ? tServiceMois($ServiceTimes->ServiceTimeTachoDetail) : array();
		} else {
	//		$ServiceTimes = null;
			$retour = array('erreur'=>$erreurs->Error);
		}
	}
			
	return $retour;
}

function getServiceTachyDriversPeriode($clientSoap, $login, $dateDeb, $dateFin, $tabDriver) {
	/* Create Soap client */
//	$clientSoap = new SoapClient($unWsdl);
	$tabTmpTachy = array();

	$sender = soapInitSenderServiceTimesTachoDetail( $login, $dateDeb, $dateFin );

	$Identifier = new stdClass();
	$Identifier->IdentifierType = "TRANSICS_ID";
	$Identifier->Id = 0;
	
	foreach( $tabDriver as &$driver ) {
		if(!$driver->Inactive) {

			$driverTransicsID = intval( $driver->PersonTransicsID );
			$Identifier->Id = intval( $driver->PersonTransicsID );
			$sender->ServiceTimesSelection->Drivers = array( $Identifier ); 
			$result = array();
			date_default_timezone_set('Europe/Paris');

		//	for( $dateCour = $dateInf ; $dateCour <= $dateSup ; $dateCour->add($ti) ) {
			for( $dateCour = clone $dateDeb ; $dateCour <= $dateFin ; date_add($dateCour, date_interval_create_from_date_string('1 days')) ) {
				$strDate = $dateCour->format('Y-m-d');
//				$tabTmpTachy[$driverTransicsID][$strDate] = getServiceTachyDriver( $clientSoap, $sender, $strDate );
				$result = getServiceTachyDriver( $clientSoap, $sender, $strDate ) + $result;
			};
			$driver->tService = $result;
			$tabTmpTachy[] = $driver;
		}
	}
	
	return $tabTmpTachy;
}


// Parcourt un tableau de coducteur et affecte les temps de service
function tServiceTachyDrivers($clientSoap, $login, $dateDeb, $dateFin, $tabDriver) {
	$serviceTachyDrivers = array();
	$sender = soapInitSenderServiceTimesTachoDetail( $login, $dateDeb, $dateFin );

	$Identifier = new stdClass();
	$Identifier->IdentifierType = "TRANSICS_ID";
	$Identifier->Id = 0;
	
	foreach( $tabDriver as &$driver ) {
		if(!$driver->Inactive) {
			set_time_limit ( 120 );

			$driverTransicsID = intval( $driver->PersonTransicsID );
			$Identifier->Id = intval( $driver->PersonTransicsID );
			$sender->ServiceTimesSelection->Drivers = array( $Identifier ); 
			
			try {
				$resultTT = $clientSoap->Get_ServiceTimesTachoDetail($sender);
			} catch (Exception $e) {
				$resultTT = null;
			}
			
			if( !is_null($resultTT) ) {
				$erreurs = $resultTT->Get_ServiceTimesTachoDetailResult->Errors;
				
				if( !isset($erreurs->Error) ) {
					$ServiceTimes = $resultTT->Get_ServiceTimesTachoDetailResult->ServiceTimes;
					$driver->tService = (isset( $ServiceTimes->ServiceTimeTachoDetail )) ? tServiceMois($ServiceTimes->ServiceTimeTachoDetail) : array();
				} else {
					$driver->tService = array('erreur'=>$erreurs->Error);
				}
			}
			$serviceTachyDrivers[] = $driver;
		}
	}
	
	return $serviceTachyDrivers;
}

// Rapport de consommation pour le jour
function consumptionReport( $unWsdl, $login, $unIdTransics = null ){
	
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
		'cache_wsdl'=> WSDL_CACHE_BOTH 
	); 
	try {
		$clientSoap = new SoapClient($unWsdl, $options);
	} catch (Exception $e) {
		echo 'Exception reçue : ',  $e->getMessage(), "\n";
	}
	
	if( !isset($clientSoap) ){
		echo 'Exception clientSoap\n';
	}
	
	/* Create selection object */
	$ConsumptionReportSelection = new stdClass();

	$aujoudhui = new DateTime();

	$DateTimeRangeSelection = new stdClass();
	$DateTimeRangeSelection->StartDate = $aujoudhui->format('Y-m-d') . 'T00:00:00';
	$DateTimeRangeSelection->EndDate = $aujoudhui->format('Y-m-d') . 'T23:00:00';

	$Driver = new stdClass();
	$Driver->IdentifierType = 'TRANSICS_ID';
	$Driver->Id = $unIdTransics;

	$ConsumptionReportSelection->Drivers = array($Driver);
	$ConsumptionReportSelection->DateTimeRangeSelection = $DateTimeRangeSelection;
	$ConsumptionReportSelection->SummaryLevel = 'Day';
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ConsumptionReportSelection = $ConsumptionReportSelection;

	/* Call the webservice */
	return $clientSoap->Get_ConsumptionReport($sender);
}
?>
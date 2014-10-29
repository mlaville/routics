<?php

function soapGetDispatchers( $unWsdl, $login, $unCode ){
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
	set_time_limit ( 200 );
	try {
//		$clientSoap = new SoapClient($unWsdl, $options);
		$clientSoap = new SoapClient($unWsdl);
	} catch (Exception $e) {
//		echo 'Exception reçue : ',  $e->getMessage(), "\n";
//	}
		$retour = array( "succes" => false, "error" => array( "reason" => $e->getMessage() ) );
		die( htmlspecialchars_decode( json_encode( $retour ), ENT_QUOTES ) );
	}

	/* Create Person object */
	$Person = new stdClass();
	$Person->IdentifierType = 'ID';
	$Person->Id = $unCode;
	
	/* Create selection object */
	$DispatcherSelection = new stdClass();
	$DispatcherSelection->Persons = array($Person);
	$DispatcherSelection->ExcludeInactiveDispatchers = true;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->DispatcherSelection=$DispatcherSelection;
	
	/* Call the webservice */
	return $clientSoap->Get_Dispatchers($sender);
}

function soapGetDrivers( $unWsdl, $login ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);

	/* Create selection object */
	$DriverSelection = new stdClass();
	$DriverSelection->ExcludeInactiveDrivers = true;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->DriverSelection=$DriverSelection;

	/* Call the webservice */
	return $client->Get_Drivers_V5($sender);
}

function soapGetVehicles( $unWsdl, $login, $uneDate ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);

	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDate;
	$DateTimeRange->EndDate = null;

	/* Create selection object */
	$VehicleSelection = new stdClass();
	$VehicleSelection->DateTimeRange = $DateTimeRange;
	$VehicleSelection->IncludeDrivers = true;
	$VehicleSelection->IncludeActivity = true;

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection=$VehicleSelection;

	/* Call the webservice */
	return $client->Get_Vehicles($sender);
}


/*
 * Recupere la Table des Remorques
 */
function soapGetTrailers( $unWsdl, $login ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);

	/* Create selection object */
	$VehicleSelection = new stdClass();
	$VehicleSelection->ExcludeInactive = true;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection=$VehicleSelection;
//	$sender->VehicleSelection = new stdClass();

	/* Call the webservice */
	return $client->Get_Trailers($sender);
}

function soapGetActivityConduiteReport( $unWsdl, $login, $uneDateInf, $uneDateSup ){
	return soapGetActivityReport( $unWsdl, $login, '128', $uneDateInf, $uneDateSup );
}

function soapGetActivityReport( $unWsdl, $login, $unCodeActivite, $uneDateInf, $uneDateSup ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);

	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDateInf;
	$DateTimeRange->EndDate = $uneDateSup;

	/* Create Activity object */
	$Activity = new stdClass();
	$Activity->ID = $unCodeActivite; // Conduire
//	$Activity->ID = '19';// Accrocher
//	$Activity->ID = '133';// Remorque

	/* Create selection object */
	$ActivityReportSelection = new stdClass();
	$ActivityReportSelection->DateTimeRangeSelection = $DateTimeRange;
	$ActivityReportSelection->Activities = array($Activity);

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ActivityReportSelection=$ActivityReportSelection;

	/* Call the webservice */
	return $client->Get_ActivityReport($sender);
}

function soapGetActivityReportVehicle( $unWsdl, $login, $unCodeVehicle, $uneDateInf, $uneDateSup ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);

	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDateInf;
	$DateTimeRange->EndDate = $uneDateSup;

	/* Create Vehicle object */
	$Vehicle = new stdClass();
	$Vehicle->IdentifierVehicleType = 'TRANSICS_ID';
	$Vehicle->Id = $unCodeVehicle;

	/* Create selection object */
	$ActivityReportSelection = new stdClass();
	$ActivityReportSelection->DateTimeRangeSelection = $DateTimeRange;
//	$ActivityReportSelection->Activities = array($Activity);
	$ActivityReportSelection->Vehicles = array($Vehicle);

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ActivityReportSelection=$ActivityReportSelection;

	/* Call the webservice */
	return $client->Get_ActivityReport($sender);
}

function soapGetVehicleActivityInfo( $unWsdl, $login, $uneDate, $arrVehicule /*  $unId */ ){

	/* Create Soap client */
	$client = new SoapClient($unWsdl);

	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDate;
	$DateTimeRange->EndDate = null;
	$DateTimeRange->DateTypeSelection = 'STARTED';
	
	/* Create Vehicle object */
	$Vehicle = new stdClass();
//	$Vehicle->IdentifierVehicleType = 'TRANSICS_ID';
//	$Vehicle->Id = $unId;
	$Vehicle->IdentifierVehicleType = $arrVehicule["IdentifierVehicleType"];
	$Vehicle->Id = $arrVehicule["Id"];
	
	/* Create selection object */
	$VehicleActivitySelection = new stdClass();
	$VehicleActivitySelection->DateTimeRange = $DateTimeRange;
	$VehicleActivitySelection->Vehicles = array($Vehicle);

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleActivitySelection=$VehicleActivitySelection;
	
	/* Call the webservice */
	return $client->Get_VehicleActivityInfo($sender);
}

function soapVehicleInfo_On_Date( $unWsdl, $login, $uneDate, $unId ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);
	
	$VehicleOnDateSelection = new stdClass();
	$VehicleOnDateSelection->DateTime = $uneDate;
	
	if($unId > 0){
		/* Create Vehicle object */
		$Vehicle = new stdClass();
		$Vehicle->IdentifierVehicleType = 'TRANSICS_ID';
		$Vehicle->Id = $unId;
	//	$Vehicle->IdentifierVehicleType = $arrVehicule["IdentifierVehicleType"];
	//	$Vehicle->Id = $arrVehicule["Id"];

		$VehicleOnDateSelection->Vehicles = array($Vehicle);
	}
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleOnDateSelection=$VehicleOnDateSelection;
	
	/* Call the webservice */
	return $client->Get_VehicleInfo_On_Date($sender);
}

function soapGetVehicleV7( $unClient, $login, $idTransics ){

	// Sélection du véhicule
	$IdentifierVehicle = new stdClass();
    $IdentifierVehicle->IdentifierVehicleType = "TRANSICS_ID";
    $IdentifierVehicle->Id = $idTransics;
	
	// Create selection object 
	$VehicleSelection = new stdClass();
	$VehicleSelection->Identifiers = array($IdentifierVehicle);
	
	$VehicleSelection->IncludeTechnicalInfo = true;
	$VehicleSelection->IncludePosition = true;
	$VehicleSelection->IncludeActivity = true;
	$VehicleSelection->IncludeDrivers = true;
	$VehicleSelection->IncludeUpdateDates = true;
	$VehicleSelection->ExcludeInactive = true;

	// Create global sender object 
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection=$VehicleSelection;
	
	// Call the webservice 
	return $unClient->Get_Vehicles_V7($sender);
}

/*
function soapGetVehicleV7( $unWsdl, $login ){
	// Create Soap client 
	$client = new SoapClient($unWsdl);
	
	// Create selection object 
	$VehicleSelection = new stdClass();
	$VehicleSelection->IncludeTechnicalInfo = true;
	$VehicleSelection->IncludeUpdateDates = true;
	$VehicleSelection->ExcludeInactive = true;

	// Create global sender object 
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->VehicleSelection=$VehicleSelection;
	
	// Call the webservice 
	return $client->Get_Vehicles_V7($sender);
}
*/
function soapGetActivityReportDriver( $unWsdl, $login, $uneDateInf, $uneDateSup, $unCodeDriver ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);

	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDateInf;
	$DateTimeRange->EndDate = $uneDateSup;

	/* Create selection object */
	$ActivityReportSelection = new stdClass();
	$ActivityReportSelection->DateTimeRangeSelection = $DateTimeRange;

	/* Create Drivers object */
	if( $unCodeDriver != null ) {
		$Drivers = new stdClass();
		$Drivers->IdentifierType = 'TRANSICS_ID';
		$Drivers->Id = $unCodeDriver;
		$ActivityReportSelection->Drivers = array($Drivers);
	}
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ActivityReportSelection=$ActivityReportSelection;

	/* Call the webservice */
	return $client->Get_ActivityReport($sender);
}

function soapGetServiceTimesTachoDetail( $unWsdl, $login, $idTransics, $dateDeb, $dateFin ){
	/* Create Soap client */
	$client = new SoapClient($unWsdl);
	
	$Identifier = new stdClass();
	$Identifier->IdentifierType = "TRANSICS_ID";
	$Identifier->Id = $idTransics;
	
	$DateTimeRangeSelection = new stdClass();
	$DateTimeRangeSelection->StartDate = $dateDeb;
	$DateTimeRangeSelection->EndDate = $dateFin;

	/* Create selection object */
	$ServiceTimesSelection = new stdClass( );
	$ServiceTimesSelection->Drivers = array( $Identifier );
	$ServiceTimesSelection->DateTimeRangeSelection = $DateTimeRangeSelection;

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ServiceTimesSelection = $ServiceTimesSelection;
	
	/* Call the webservice */
	try {
		$r = $client->Get_ServiceTimesTachoDetail($sender);
	} catch (Exception $e) {
		$r = $e;
	}
	return $r;
}

function soapSenderGetServiceTimesTachoDetail( $login, $idTransics, $dateDeb, $dateFin ){
	/* Create Soap client */
//	$client = new SoapClient($unWsdl);
	
	$Identifier = new stdClass();
	$Identifier->IdentifierType = "TRANSICS_ID";
	$Identifier->Id = $idTransics;
	
	$DateTimeRangeSelection = new stdClass();
	$DateTimeRangeSelection->StartDate = $dateDeb;
	$DateTimeRangeSelection->EndDate = $dateFin;

	/* Create selection object */
	$ServiceTimesSelection = new stdClass( );
	$ServiceTimesSelection->Drivers = array( $Identifier );
	$ServiceTimesSelection->DateTimeRangeSelection = $DateTimeRangeSelection;

	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ServiceTimesSelection = $ServiceTimesSelection;
	
	return $sender;
}

function odbActivityDriver($unWsdl, $login, $uneDateInf, $uneDateSup, $unIdTransicsDriver) {

	/* Create Soap client */
	$clientSoap = new SoapClient($unWsdl);

	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDateInf;
	$DateTimeRange->EndDate = $uneDateSup;

	/* Create selection object */
	$ActivityReportSelection = new stdClass();
	$ActivityReportSelection->DateTimeRangeSelection = $DateTimeRange;

	/* Create Drivers object */
	if( $unIdTransicsDriver != null ) {
		$Drivers = new stdClass();
		$Drivers->IdentifierType = 'TRANSICS_ID';
		$Drivers->Id = $unIdTransicsDriver;
		$ActivityReportSelection->Drivers = array($Drivers);
	}
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ActivityReportSelection=$ActivityReportSelection;

	/* Call the webservice */
	return $clientSoap->Get_ActivityReport($sender);
}


function senderOdbActivityDriver( $login, $uneDateInf, $uneDateSup, $unIdTransicsDriver ) {

	$DateTimeRange = new stdClass();
	$DateTimeRange->StartDate = $uneDateInf;
	$DateTimeRange->EndDate = $uneDateSup;

	/* Create selection object */
	$ActivityReportSelection = new stdClass();
	$ActivityReportSelection->DateTimeRangeSelection = $DateTimeRange;

	/* Create Drivers object */
	if( $unIdTransicsDriver != null ) {
		$Drivers = new stdClass();
		$Drivers->IdentifierType = 'TRANSICS_ID';
		$Drivers->Id = $unIdTransicsDriver;
		$ActivityReportSelection->Drivers = array($Drivers);
	}
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ActivityReportSelection=$ActivityReportSelection;
}


function getActiDriver( $wsdl, $login, $dateRef, $idTransicsDrivers ) {
	date_default_timezone_set('Europe/Paris');
	$dateInf = $dateRef . "T00:00:00+00:00"; // '2013-03-26T00:51:30+00:00'
	$dateSup = $dateRef . "T23:59:59+00:00"; // '2013-03-26T00:51:30+00:00'

	$resultActivite = odbActivityDriver( $wsdl, $login, $dateInf, $dateSup, $idTransicsDrivers );

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
		$duree = $dtFin->getTimestamp() - $dtDeb->getTimestamp();
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
};

?>
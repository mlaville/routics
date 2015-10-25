<?php
/**
 * insertReportConsommation.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       24/10/2015
 * @version    0.1.0
 * 
 * Lecture des activite de conduite via les WebServices Transics et enregistrement dans la base de données
 *
 * A faire :
 * - Enregistrement des données Vehicule dans la base
 */
 
/*
         <tran:ConsumptionReportSelection>
            <tran:SummaryLevel>Day</tran:SummaryLevel>
            <!--Optional:-->
             <tran:DateTimeRangeSelection>
               <tran:StartDate>2015-09-01T00:00:00</tran:StartDate>
               <tran:EndDate>2015-09-30T23:59:59</tran:EndDate>
               
            </tran:DateTimeRangeSelection>
            <!--Optional:-->
            <tran:Drivers>
                    <tran:Identifier>
                  <tran:IdentifierType>TRANSICS_ID</tran:IdentifierType>
                  <!--Optional:-->
                  <tran:Id>130</tran:Id>
               </tran:Identifier>
            </tran:Drivers>
         </tran:ConsumptionReportSelection>
*/

include '../php/connect.inc.php';
include '../php/soap/funcDrivers.php';

function consumptionReportSelection( $unCodeDriver, $uneDateInf, $uneDateSup ) {

	$ConsumptionReportSelection = new stdClass();
	$DateTimeRange = new stdClass();
	
	$DateTimeRange->StartDate = $uneDateInf;
	$DateTimeRange->EndDate = $uneDateSup;

	/* Create Activity object */
	$Identifier = new stdClass();
	$Identifier->IdentifierType = "TRANSICS_ID";
	$Identifier->Id = $unCodeDriver;

	/* Create selection object */
	$ConsumptionReportSelection->DateTimeRangeSelection = $DateTimeRange;
	$ConsumptionReportSelection->Drivers = array($Identifier);

	return $ConsumptionReportSelection;
}

// $unCodeVehicule : 
function soapConsumptionReport( $soapClient, $login, $unCodeDriver, $uneDateInf, $uneDateSup ){

	$retour = null;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ConsumptionReportSelection = consumptionReportSelection( $unCodeDriver, $uneDateInf, $uneDateSup );

	set_time_limit( 300 );
	/* Call the webservice */
	try{
		$soapConsumptionReport = $soapClient->Get_ConsumptionReport($sender);
		if( isset($soapConsumptionReport->Get_ConsumptionReportResult->ConsumptionReportItems) ) {
			$retour = $soapConsumptionReport->Get_ConsumptionReportResult->ConsumptionReportItems;
		} else {
			echo $unCodeDriver . ' : ' . json_encode($soapConsumptionReport) . "\n";
		}
		
	} catch(SoapFault $e){
		print_r($e);
		// or other error handling
	}
	return is_null($retour) ? null : $retour; 
}

function calcLogin() {
	/* Create login object */
	$login = new stdClass();

	$login->DateTime = date(DateTime::W3C);
	$login->Dispatcher = 'POLINUX';
	$login->Password = 'POLINUX_1333';
	$login->SystemNr = 2858;
	$login->Integrator = '2858_POLINUX_01';
	$login->Language = 'fr';
	$login->ApplicationName = 'routics';
	$login->ApplicationVersion = '0.1.2';
	$login->Version = '0';
	
	return $login;
}


function insertActivite( $dbFlotte, $arrActivite ) {
	$stmt = $dbFlotte->prepare( "REPLACE INTO t_km_parcourt ("
					. " TransicsID, Driver, DriverTransicsId, Trailer, Vehicle, VehicleTransicsId, PoiID, KmBegin, KmEnd, BeginDate, EndDate, AddressInfo, km_dateImport"
					. " ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW() )" );

	foreach( $arrActivite as &$activite ) {
		// Enregistrement 
		if(isset( $activite->Vehicle )) {

			$idTrailer = isset($activite->Trailer)
				? $activite->Trailer->ID
				: ( isset($activite->Trailer_External) ? $activite->Trailer_External : 0 );
			$AddressInfo = isset($activite->Position) ? $activite->Position->AddressInfo : null;
			$data = array( $activite->ID,							$activite->Driver->ID,
							$activite->Driver->TransicsID,
							$idTrailer, 
							$activite->Vehicle->ID, 
							$activite->Vehicle->TransicsID, 
							isset( $activite->POI ) ? $activite->POI->PoiID : null,
							$activite->KmBegin, 
							$activite->KmEnd, 
							$activite->BeginDate, 
							$activite->EndDate,
							$AddressInfo
					);
							
			$res = $stmt->execute( $data );
			
			if( !$res ){
				$err = $stmt->errorInfo();
				echo '<br>' . $activite->Vehicle->TransicsID . ' le ' . $activite->BeginDate . ' -> ' . $err[2] . '<br>' . PHP_EOL;
			}
		} else {
			print_r( json_encode( array( 'activite'=>$activite )) . '<br>' . PHP_EOL );
		}
	}
	
	return;
}

function insertReportConsommation( $dbFlotte, $clientSoap, $login, $mois ) {
	$soapDrivers = soapGetDrivers( $clientSoap, $login );
	$arrDrivers = $soapDrivers["result"];
//	$dateInf = $dateRef . "T00:00:00+00:00"; // '2013-03-26T00:51:30+00:00'
//	$dateSup = $dateRef . "T23:59:59+00:00"; // '2013-03-26T00:51:30+00:00'
$dateRef = 
	$dateInf = date_format($dateRef, 'Y-m-d') . "T00:00:00+00:00"; // '2013-03-26T00:51:30+00:00'
	$dateSup = date_format($dateRef, 'Y-m-d') . "T23:59:59+00:00"; // '2013-03-26T00:51:30+00:00'

	foreach( $arrVehicules as &$vehicule ) {
		$result = soapListActivityReport( $clientSoap, $login, $vehicule->VehicleTransicsID, 128, $dateInf, $dateSup );

		if( !is_null($result) )
			insertActivite( $dbFlotte, $result );
	}

	return;
}

date_default_timezone_set('Europe/Paris');
set_time_limit( 300 );

$filename = './traceConsommation.log';
$tab = file( $filename, FILE_SKIP_EMPTY_LINES );
$tz = new DateTimeZone('Europe/Paris');
$lastDate = new DateTime( array_pop( $tab ), $tz );

if( $lastDate < new DateTime( '2 days ago', $tz ) ) {
	$lastDate->add(new DateInterval('P1D'));

	insertActiConduite( $dbFlotte,
					new SoapClient("http://transics.tx-connect.com/IWSLead/Service.asmx?WSDL"),
					calcLogin(),
					$lastDate
	//				date( "Y-m-d", mktime(0, 0, 0, date("m"), date("d") - 1, date("y")) )
	//				date( "Y-m-d", mktime(0, 0, 0, date("m"), date("d") - 2, 2013) )
				); // '2013-03-26T00:51:30+00:00'

	file_put_contents( $filename, date_format($lastDate, 'Y-m-d') . PHP_EOL, FILE_APPEND | LOCK_EX );
}
?>
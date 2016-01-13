<?php
/**
 * insertReportConsommation.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       29/10/2015
 * @version    0.1.0
 * 
 * Lecture des rapports de consommation via les WebServices Transics et enregistrement dans la base de données
 *
 * A faire :
 * - 
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

// $unCodeVehicule : 
function soapConsumptionReport( $soapClient, $login, $consumptionReportSelection ){

	$retour = null;
	
	/* Create global sender object */
	$sender = new stdClass();
	$sender->Login = $login;
	$sender->ConsumptionReportSelection = $consumptionReportSelection;

//	echo json_encode($sender). "<br />\n";
	
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


function insertConsommation( $dbFlotte, $arrConsom ) {
					
	$stmt = $dbFlotte->prepare( "INSERT INTO t_report_consom_csm ("
					. " DriverTransicsId, VehicleTransicsId, VehicleID, VehicleImmat, cms_date, Distance, Consumption_Total, Duration_Driving, conso_dateImport"
					. " ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, NOW() )" );

	foreach( $arrConsom as $consommation ) {
		
		if(is_array($consommation)) {
			return insertConsommation( $dbFlotte, $consommation );
		} else {
		// Enregistrement 
			$data = array( $consommation->Driver->TransicsID,
							$consommation->Vehicle->TransicsID, 
							$consommation->Vehicle->ID, 
							$consommation->Vehicle->LicensePlate, 
							$consommation->Date, 
							$consommation->Distance, 
							$consommation->Consumption_Total, 
							$consommation->Duration_Driving
						);
							
			$res = $stmt->execute( $data );
			
			if( !$res ){
				$err = $stmt->errorInfo();
	//			echo '<br>' . $activite->Vehicle->TransicsID . ' le ' . $activite->BeginDate . ' -> ' . $err[2] . '<br>' . PHP_EOL;
				print_r($err);
			}
			
		}
	}
	
	return;
}
function insertReportConsommation( $dbFlotte, $unWsdl, $login, $dateRef ) {
	$soapDrivers = soapGetDrivers( $unWsdl, $login );
	
	$arrDrivers = $soapDrivers->Get_Drivers_V6Result->Persons->InterfacePersonResult_V6;

	$ConsumptionReportSelection = new stdClass();
	$DateTimeRange = new stdClass();
	
	$DateTimeRange->StartDate = $dateRef->format('Y-m-d') . "T00:00:00+00:00"; // '2013-03-26T00:51:30+00:00';
	$DateTimeRange->EndDate = $dateRef->format('Y-m-d') . "T23:59:59+00:00";

	/* Create Activity object */
	$Identifier = new stdClass();
	$Identifier->IdentifierType = "TRANSICS_ID";

	/* Create selection object */
	$ConsumptionReportSelection->DateTimeRangeSelection = $DateTimeRange;
	$ConsumptionReportSelection->SummaryLevel = 'Day';

	$clientSoap = new SoapClient($unWsdl);

	foreach( $arrDrivers as &$driver ) {
//	echo json_encode($driver) . "<br/>\n";
		$Identifier->Id = $driver->PersonTransicsID;
		$ConsumptionReportSelection->Drivers = array($Identifier);
		
		$result = soapConsumptionReport( $clientSoap, $login, $ConsumptionReportSelection );
		
//		echo json_encode($result) . "<br/>\n";

		if( !is_null($result) )
			insertConsommation( $dbFlotte, $result );
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

	insertReportConsommation( $dbFlotte,
					"https://iwsfleet.tx-connect.com/IWS/Service.asmx?WSDL",
					calcLogin(),
					$lastDate
				); // '2013-03-26T00:51:30+00:00'

	file_put_contents( $filename, $lastDate->format('Y-m-d') . PHP_EOL, FILE_APPEND | LOCK_EX );
}
?>
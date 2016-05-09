<?php
/**
 * api.php
 * 
 * @auteur     marc laville
 * @Copyleft 2016
 * @date       15/03/2016
 * @version    0.1
 * @revision   $0$
 *
 * @date revision   15/03/2016  Correction du calcul de l'intervalles de date
 *
 * REST api de stat conduite
 * - remontée des heures de nuit ( pénibilité )
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
include '../../php/ident.inc.php';

include '../../php/soap/configSoap.inc.php';

require_once '../../php/config.inc.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
require_once '../Rest.inc.php';

class API extends REST {

	private $db = NULL;
	
	public function __construct(){
		parent::__construct();				// Init parent contructor
		$this->dbConnect();					// Initiate Database connection
	}
	
	/*
	 *  Connect to Database
	*/
	private function dbConnect(){
        $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';

        try {
            $this->db = new PDO($dsn, DB_USERNAME, DB_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        } catch (PDOException $e) {
            $response["status"] = "error";
            $response["message"] = 'Connection failed: ' . $e->getMessage();
            //echoResponse(200, $response);
            exit;
        }
		
		$this->db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
		$this->db->exec("SET NAMES 'utf8'");
	}
		
	/*
	 * Dynmically call the method based on the query string
	 */
	public function processApi(){
		$func = strtolower( trim( str_replace("/", "", $_REQUEST['x']) ) );

		if( (int)method_exists($this, $func) > 0 )
			$this->$func();
		else
			$this->response('', 404); // If the method not exist with in this class "Page not found".
	}
				
	private function heuresNuit(){
		if($this->get_request_method() != "GET"){
			$this->response('',406);
		}

		$moisDeb = $_GET['mois'];
		$timezone = new DateTimeZone('Europe/Paris'); 
		$dateRef = DateTime::createFromFormat('Ymd', $moisDeb . '01', $timezone);
		$dateRef->add(new DateInterval('P1Y'));
		$moisFin = $dateRef->format('Ym');
		
		$query = "SELECT"
			. " DriverTransicsId, DATE_FORMAT(BeginDate, '%m') AS Mois, DATE_FORMAT(BeginDate, '%Y-%m') AS AnMois,"
			. " COUNT(DISTINCT date(EndDate)) AS nbJours,"
			. " SUM( TIME_TO_SEC(TIMEDIFF(LEAST( EndDate, DATE(EndDate) + INTERVAL 5 HOUR ), BeginDate)) ) AS DureeSec,"
			. " SEC_TO_TIME( SUM( TIME_TO_SEC(TIMEDIFF(LEAST( EndDate, DATE(EndDate) + INTERVAL 5 HOUR ), BeginDate)) ) ) AS Duree"
			. " FROM t_km_parcourt"
			. " WHERE TIME(BeginDate) < '04:00:00' AND BeginDate < EndDate"
			. " AND DATE_FORMAT(BeginDate, '%Y%m') BETWEEN ? AND ?"
			. " GROUP BY DriverTransicsId, DATE_FORMAT(BeginDate, '%Y-%m')"
			. " ORDER BY DriverTransicsId, DATE_FORMAT(BeginDate, '%Y-%m')";

		try {
		  $stmt = $this->db->prepare($query);
		  $response["success"] = $stmt->execute( array( $moisDeb, $moisFin ) );

		  if( $response["success"] ) {
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			
			$response = array();

			foreach ($result as $hrMois) {
				$clef = $hrMois['DriverTransicsId'];
				
				if( !isset($response[$clef]) ) {
					$response[$clef] = array();
				}
				
				$response[$clef][$hrMois['AnMois']] = array( "nbJours"=>$hrMois['nbJours'], "DureeSec"=>$hrMois['DureeSec'], "Duree"=>$hrMois['Duree'] );
			}

		  }

		 } catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Select Failed: ' . $e->getMessage();
			$response["result"] = null;
		}
		$response["moisDeb"] = $moisDeb;
		$response["moisFin"] = $moisFin;
		$this->response( json_encode($response), 200 );
	}
}

$rep = identSoap( $login );
if( $rep["success"] ){
	// Initiate Library
	$api = new API;
	$api->processApi();
} else {
	echo json_encode($rep);
}
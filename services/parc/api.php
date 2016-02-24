<?php
/**
 * api.php.js
 * 
 * @auteur     marc laville
 * @Copyleft 2016
 * @date       22/02/2016
 * @version    0.1
 * @revision   $0$
 *
 * A Faire
 * - Controler l'identification Soap
 *
 * REST api de gestion du parc
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
require_once '../../php/config.inc.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
require_once '../Rest.inc.php';
	
class API extends REST {

//	public $data = "";
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
			$this->response('',404); // If the method not exist with in this class "Page not found".
	}
				
	private function updateCA(){
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		$param = json_decode(file_get_contents("php://input"),true);

		$query = "REPLACE INTO t_ca_mensuel_cam"
			. " ( mois_cam, num_parc_cam, montant_cam, nb_jour_cam, km_cam, date_import_cam, user_import_cam )"
			. " VALUES ( ?, ?, ?, ?, ?, NOW(), ? )";
				
					
		$user = isset( $_SESSION['ident'] ) ? $_SESSION['ident'] : '???';

		try {
		  $stmt = $this->db->prepare($query);
		  $response["result"] = $stmt->execute( array( $param['mois'], $param['numParc'], $param['montant'] * 100, 0, 0, $user ) );

		  if( $response["result"] ){
			$response["status"] = "success";
			$response["message"] = "Données Modifiées";
			$response["montant"] = $param['montant'];
		 } else {
			$response["status"] = "warning";
			$response["message"] = "No data found.";
		 }

		 } catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Select Failed: ' . $e->getMessage();
			$response["result"] = null;
		}
		$this->response( json_encode($response), 200 );
	}
}

// Initiiate Library
$api = new API;
$api->processApi();

<?php
/**
 * api.php
 * 
 * @auteur     marc laville
 * @Copyleft 2016
 * @date       22/02/2016
 * @version    0.1
 * @revision   $0$
 *
 * @date revision   15/03/2016  Controle l'identification Soap
 * @date revision   05/04/2016  Gere les modifications par la table "t_modif_couts_mdf"
 * @date revision 04/05/2016 Gere +sieurs conducteurs sur chaque ligne ajoutées manuellement
 * @date revision 04/05/2016 Gere la supression des lignes ajoutées manuellement
 *
 * REST api de gestion du parc
 * - CRUD CA mensuel
 *
 * A Faire
 * - Rassembler les update dans 1 seule fonction 
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
			$this->response('',404); // If the method not exist with in this class "Page not found".
	}
	/**
	 * Recherche la clef primaire pour un codeParc et un mois passés en parametre
	 * Si l'ID n'existe pas, un enregistrement est créé
	 */
	private function getIdModif( $unNumParc, $moisModif ){
		$query = "SELECT IdMdf FROM t_modif_couts_mdf WHERE mdf_numParc = ? AND mdf_mois = ?";
		
		try {
		  $stmt = $this->db->prepare($query);
		  $exec= $stmt->execute( array( $unNumParc, $moisModif ) );

		  if( $exec ){
			$result = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
		 } else {
			$result = null;
		 }

		} catch(PDOException $e) {
			$result = null;
		}
		
		if( is_null($result) ) {
			
		} else {
			if( !count($result) ) {
				$query = "INSERT INTO t_modif_couts_mdf( mdf_numParc, mdf_mois, mdf_datecrea ) VALUES ( ?, ?, NOW())";
				$stmt = $this->db->prepare($query);
				$exec= $stmt->execute( array( $unNumParc, $moisModif ) );
				
				$lastInsertId = $this->db->lastInsertId();
				$result = $lastInsertId[0];
		
			} else {
				$result = $result[0];
			}
		}
		
		return $result;
	}
	
	private function ajoutLigne(){
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		if(!isset( $_SESSION['ident'] )){
			$this->response('',401);
		} else {
			$user = $_SESSION['ident'];
		}
		
		$param = json_decode(file_get_contents("php://input"),true);
		$conduct = json_encode($param['conduct']);

		$query = "INSERT INTO t_modif_couts_mdf ( mdf_numParc, mdf_mois, mdf_immat, mdf_libConducteur, mdf_nbJours, mdf_user, mdf_datecrea)"
			. " VALUES ( ?, ?, ?, ?, ?, ?, NOW() )";
			
		try {
		  $stmt = $this->db->prepare($query);
//		  $response["result"] = $stmt->execute( array( $param['numParc'], $param['mois'], $param['immat'], $conduct, $param['jourTravail'], $user ) );
		  $response["result"] = $stmt->execute( array( $param['numParc'], $param['mois'], $param['immat'], $conduct, NULL, $user ) );

		  if( $response["result"] ){
			$response["status"] = "success";
			$response["message"] = "Données Modifiées";
		 } else {
			$response["status"] = "warning";
			$response["message"] = "No data found.";
		 }

		} catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Insert Failed: ' . $e->getMessage();
			$response["result"] = null;
		}
	
		$this->response( json_encode($response), 200 );
	}
	
	private function updateKM(){
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		if(!isset( $_SESSION['ident'] )){
			$this->response('',401);
		} else {
			$user = $_SESSION['ident'];
		}
		
		$param = json_decode(file_get_contents("php://input"),true);
		$idModif = $this->getIdModif( $param['numParc'], $param['mois'] );
		$query = "UPDATE t_modif_couts_mdf SET mdf_km = ?, mdf_user = ?, mdf_dateupdate = NOW() WHERE IdMdf = ?";

		try {
		  $stmt = $this->db->prepare($query);
		  $response["result"] = $stmt->execute( array( $param['valeur'], $user, $idModif ) );

		  if( $response["result"] ){
			$response["status"] = "success";
			$response["message"] = "Données Modifiées";
			$response["valeur"] = $param['valeur'];
		 } else {
			$response["status"] = "warning";
			$response["message"] = "No data found.";
		 }

		} catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Select Failed: ' . $e->getMessage();
			$response["result"] = null;
		}

		$response["getIdModif"] = $idModif;
		
		$this->response( json_encode($response), 200 );
	}
	
	private function updateATR(){
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		if(!isset( $_SESSION['ident'] )){
			$this->response('',401);
		} else {
			$user = $_SESSION['ident'];
		}
		
		$param = json_decode(file_get_contents("php://input"),true);
		$idModif = $this->getIdModif( $param['numParc'], $param['mois'] );
		$query = "UPDATE t_modif_couts_mdf SET mdf_cout_autoroute = ?, mdf_user = ?, mdf_dateupdate = NOW() WHERE IdMdf = ?";

		try {
		  $stmt = $this->db->prepare($query);
		  $response["result"] = $stmt->execute( array( $param['valeur'], $user, $idModif ) );

		  if( $response["result"] ){
			$response["status"] = "success";
			$response["message"] = "Données Modifiées";
			$response["valeur"] = $param['valeur'];
		 } else {
			$response["status"] = "warning";
			$response["message"] = "No data found.";
		 }

		} catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Select Failed: ' . $e->getMessage();
			$response["result"] = null;
		}

		$response["getIdModif"] = $idModif;
		
		$this->response( json_encode($response), 200 );
	}
	
	private function updateOil(){
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		if(!isset( $_SESSION['ident'] )){
			$this->response('',401);
		} else {
			$user = $_SESSION['ident'];
		}
		
		$param = json_decode(file_get_contents("php://input"),true);
		$idModif = $this->getIdModif( $param['numParc'], $param['mois'] );
		$query = "UPDATE t_modif_couts_mdf SET mdf_gasoil = ?, mdf_user = ?, mdf_dateupdate = NOW() WHERE IdMdf = ?";

		try {
		  $stmt = $this->db->prepare($query);
		  $response["result"] = $stmt->execute( array( $param['valeur'], $user, $idModif ) );

		  if( $response["result"] ){
			$response["status"] = "success";
			$response["message"] = "Données Modifiées";
			$response["valeur"] = $param['valeur'];
		 } else {
			$response["status"] = "warning";
			$response["message"] = "No data found.";
		 }

		} catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Select Failed: ' . $e->getMessage();
			$response["result"] = null;
		}

		$response["getIdModif"] = $idModif;
		
		$this->response( json_encode($response), 200 );
	}
	
	private function updateCA(){
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		if(!isset( $_SESSION['ident'] )){
			$this->response('',401);
		} else {
			$user = $_SESSION['ident'];
		}
		
		$param = json_decode(file_get_contents("php://input"),true);

		$idModif = $this->getIdModif( $param['numParc'], $param['mois'] );
		$query = "UPDATE t_modif_couts_mdf SET mdf_ca = ?, mdf_user = ?, mdf_dateupdate = NOW() WHERE IdMdf = ?";

		try {
		  $stmt = $this->db->prepare($query);
		  $response["result"] = $stmt->execute( array( $param['valeur'] * 100, $user, $idModif ) );

		  if( $response["result"] ){
			$response["status"] = "success";
			$response["message"] = "Données Modifiées";
			$response["valeur"] = $param['valeur'];
		 } else {
			$response["status"] = "warning";
			$response["message"] = "No data found.";
		 }

		} catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Select Failed: ' . $e->getMessage();
			$response["result"] = null;
		}

		$response["getIdModif"] = $idModif;
		
//		$response["getIdModif"] = $this->getIdModif( $param['numParc'], $param['mois'] );
		
		$this->response( json_encode($response), 200 );
	}

	private function delLigne(){
		if($this->get_request_method() != "DELETE"){
			$this->response('',406);
		}
		if(!isset( $_SESSION['ident'] )){
			$this->response('',401);
		} else {
			$user = $_SESSION['ident'];
		}
		
		$query = "DELETE FROM t_modif_couts_mdf WHERE IdMdf = ?";
			
		try {
		  $stmt = $this->db->prepare($query);
		  $response["result"] = $stmt->execute( array($_GET['id']) );

		  if( $response["result"] ){
			$response["status"] = "success";
			$response["message"] = "Données Supprimées";
		 } else {
			$response["status"] = "warning";
			$response["message"] = "No data found.";
		 }

		} catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Insert Failed: ' . $e->getMessage();
			$response["result"] = null;
		}
	
		$this->response( json_encode($response), 200 );
	}
	
	private function listModif(){
		if($this->get_request_method() != 'GET'){
			$this->response('', 406);
		}
		if(!isset( $_SESSION['ident'] )){
			$this->response('', 401);
		} else {
			$user = $_SESSION['ident'];
		}

		$query = "SELECT IdMdf, mdf_numParc, mdf_immat, mdf_libConducteur, ROUND(mdf_ca / 100, 2) AS mdf_ca, mdf_nbJours, mdf_km, mdf_cout_autoroute, mdf_gasoil"
			. " FROM t_modif_couts_mdf"
			. " WHERE mdf_mois = ?";
/*			
		$query .= "UNION"
			. " SELECT DISTINCT NULL AS IdMdf, mdf_numParc, mdf_immat, mdf_libConducteur,"
			. " 0 AS mdf_ca, 0 AS mdf_nbJours, 0 AS mdf_km, 0 AS mdf_cout_autoroute, 0 AS mdf_gasoil"
			. " FROM t_modif_couts_mdf WHERE mdf_immat IS NOT NULL AND mdf_numParc NOT IN (SELECT mdf_numParc FROM t_modif_couts_mdf WHERE mdf_mois = ?)";
	*/		
		try {
		  $stmt = $this->db->prepare($query);
		  $exec= $stmt->execute( array( $_GET['mois'] ) );
		  if( $exec ){
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		 } else {
			$result = null;
		 }
		} catch(PDOException $e) {
			$result = null;
		}
		if(!is_null($result)) {
			foreach ($result as &$modif){
				//commandes
				$modif['mdf_libConducteur'] = json_decode($modif['mdf_libConducteur']);
			}			
		}
		
		$response["result"] = $result;
		
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
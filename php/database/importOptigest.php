<?php

function importOptigest( $dbConn, $path, $separateur ) {

	$reqInsertImport = "INSERT INTO t_import_optigest ( opt_codeConduc, opt_dateActi,"
			. " opt_tmpConduite, opt_tmps2, opt_tmps3, opt_tmps4, opt_dateImport, opt_userImport )" 
			. " VALUES ( ?, ?, ?, ?, ?, ?, NOW( ), ? )";
			
	
	$stmt = $dbConn->prepare( $reqInsertImport );
	
	$result = array();
	$lines = file( $path );

	foreach($lines as $line) {
	
		$line = trim($line);
		if( strlen($line) ) {
		
			list($codeConduc, $dateActi, $tmps2, $tmps3, $tmpConduite, $tmps4, $tmps5, $tmps6, $tmps7) = explode($separateur, $line);
			list($jour, $mois, $annee) = explode( '/' , $dateActi );
			list($heure, $mn) = explode( ':' , $tmpConduite );
			
			$codeConduc = trim($codeConduc);
			
			if( !array_key_exists( $codeConduc, $result ) ) {
				$result[$codeConduc] = 0;
			}
			$result[$codeConduc] += intval($heure) * 60 + intval($mn);
			
//			echo $codeConduc . '; 20' . $annee . '-' . $mois . '-' . $jour . '<br>';
			$rep = array( "success"=>$stmt->execute( array(
						$codeConduc,
						'20' . $annee . '-' . $mois . '-' . $jour,
						intval($heure) * 60 + intval($mn),
						0,
						0,
						0,
						''
					) ) );
			if($rep["success"]){
			} else {
				$err = $stmt->errorInfo();
				$rep["error"] = array( "reason"=>$err[2] );
				echo $err[2]  . '<br>';
			}
		}
	}

	return $result;
}

//importOptigest( 'file://C:/wamp/www/Transics/data/getDrivers.json' );
//importOptigest( 'http://www.polinux.fr/polinux.html' );
?>
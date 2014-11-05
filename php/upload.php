<?php
/**
 * upload.php
 * 
 * @auteur     marc laville
 * @Copyleft 2014
 * @date       01/03/2014
 * @version    0.1.0
 *
 *
 * Upload et traitement de Fichier
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/* 
  * Traitement des données disque Optigest
  */
function importOptigest( $path, $separateur ) {

	$result = array();
	$lines = file( $path );

	foreach($lines as $line) {
	
		$line = trim($line);
		if( strlen($line) ) {
		
			list($codeConduc, $dateActi, $tmps2, $tmps3, $tmpConduite, $tmps5, $tmps6, $tmps7, $tmpTotDisk, $tmps8) = explode($separateur, $line);
			list($jour, $mois, $annee) = explode( '/' , $dateActi );
			list($heure, $mn) = explode( ':' , $tmpConduite );
			list($heureTot, $mnTot) = explode( ':' , $tmpTotDisk );
			
			$codeConduc = trim($codeConduc);
			
			if( !array_key_exists( $codeConduc, $result ) ) {
				$result[$codeConduc] = array( "tmpConduite" => 0, "tmpTotDisk" => 0);
			}
			$result[$codeConduc]["tmpConduite"] += intval($heure) * 60 + intval($mn);
			$result[$codeConduc]["tmpTotDisk"] += intval($heureTot) * 60 + intval($mnTot);
		}
	}

	return $result;
}

function bytesToSize1024($bytes, $precision = 2) {
    $unit = array('B','KB','MB');
    return @round($bytes / pow(1024, ($i = floor(log($bytes, 1024)))), $precision).' '.$unit[$i];
}

$uploads_dir = "../uploads";

$sFileName = $_FILES['image_file']['name'];
$sFileType = $_FILES['image_file']['type'];
$sFileSize = bytesToSize1024($_FILES['image_file']['size'], 1);

$tmp_name = $_FILES["image_file"]["tmp_name"];

move_uploaded_file($tmp_name, "$uploads_dir/$sFileName");

$response = array( "succes" => true,
				"msg" => "Your file: {$sFileName} has been successfully received.",
				"type" => "Type: {$sFileType}",
				"size" => "Size: {$sFileSize}",
				"result" => importOptigest( "$uploads_dir/$sFileName", '|')
			);
			
/* Prints out the response object */
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $response ), ENT_QUOTES );
?>
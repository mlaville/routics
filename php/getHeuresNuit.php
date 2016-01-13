<?php
/**
 * getHeuresNuit.php
 */
include 'connect.inc.php';

include 'database/funcActivite.php';

$result = selectActivite($dbFlotte, '2015', '05:00:00');
$response = array();

foreach ($result as $hrMois) {
	$clef = $hrMois['DriverTransicsId'];
	
	if( !isset($response[$clef]) ) {
		$response[$clef] = array();
	}
	
//	$response[$clef][] = array( "mois"=>$hrMois['Mois'] , "Duree"=>$hrMois['Duree'] );
	$response[$clef][$hrMois['Mois']] = array( "nbJours"=>$hrMois['nbJours'], "DureeSec"=>$hrMois['DureeSec'], "Duree"=>$hrMois['Duree'] );
}

header("Content-Type: application/json");
echo htmlspecialchars_decode(json_encode($response), ENT_QUOTES);
?>

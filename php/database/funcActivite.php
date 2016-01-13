<?php
/**
 * funcActivite.php
 
SELECT `DriverTransicsId`, DATE_FORMAT(BeginDate, '%Y-%m'), TIME(`BeginDate`), `EndDate`, `KmEnd`-`KmBegin`, TIMEDIFF(EndDate,BeginDate), TIME_TO_SEC(TIMEDIFF(EndDate,BeginDate)),
 
 BeginDate + INTERVAL 1 HOUR,
 DATE(EndDate + INTERVAL 1 HOUR),
 GREATEST( BeginDate + INTERVAL 1 HOUR, DATE(EndDate + INTERVAL 1 HOUR) ),
 LEAST( EndDate + INTERVAL 1 HOUR, DATE(EndDate + INTERVAL 1 HOUR) + INTERVAL 5 HOUR ),
 TIME_TO_SEC(TIMEDIFF(LEAST( EndDate + INTERVAL 1 HOUR, DATE(EndDate + INTERVAL 1 HOUR) + INTERVAL 5 HOUR ),GREATEST( BeginDate + INTERVAL 1 HOUR, DATE(EndDate + INTERVAL 1 HOUR) )))
 
 FROM `t_km_parcourt` 
 
 WHERE ( TIME(`BeginDate`) < '04:00:00' OR TIME(`EndDate`) > '23:00:00' ) 
          
          AND YEAR(BeginDate) = 2015 AND BeginDate < EndDate
ORDER BY TIME(BeginDate)  DESC * 

****

SELECT `DriverTransicsId`, DATE_FORMAT(BeginDate, '%Y-%m'), TIME(`BeginDate`), `EndDate`, `KmEnd`-`KmBegin`, TIMEDIFF(EndDate,BeginDate), TIME_TO_SEC(TIMEDIFF(EndDate,BeginDate)),
 
 BeginDate + INTERVAL 1 HOUR,
 DATE(EndDate + INTERVAL 1 HOUR),
 GREATEST( BeginDate + INTERVAL 1 HOUR, DATE(EndDate + INTERVAL 1 HOUR) ),
 LEAST( EndDate + INTERVAL 1 HOUR, DATE(EndDate + INTERVAL 1 HOUR) + INTERVAL 5 HOUR ),
 SEC_TO_TIME( SUM(
 TIME_TO_SEC(TIMEDIFF(LEAST( EndDate + INTERVAL 1 HOUR, DATE(EndDate + INTERVAL 1 HOUR) + INTERVAL 5 HOUR ),GREATEST( BeginDate + INTERVAL 1 HOUR, DATE(EndDate + INTERVAL 1 HOUR) )))
 ) )
 FROM `t_km_parcourt` 
 
 WHERE ( TIME(`BeginDate`) < '04:00:00' OR TIME(`EndDate`) > '23:00:00' ) 
          
          AND YEAR(BeginDate) = 2015 AND BeginDate < EndDate
GROUP BY DriverTransicsId, DATE_FORMAT(BeginDate, '%Y-%m')
ORDER BY DriverTransicsId, DATE_FORMAT(BeginDate, '%Y-%m')

SELECT `DriverTransicsId`, DATE_FORMAT(BeginDate, '%Y-%m'), TIME(`BeginDate`), `EndDate`, LEAST( EndDate, DATE(EndDate) + INTERVAL 5 HOUR ), TIME_TO_SEC(TIMEDIFF(LEAST( EndDate, DATE(EndDate) + INTERVAL 5 HOUR ), BeginDate)) -- SEC_TO_TIME( SUM( ) ) FROM `t_km_parcourt` WHERE ( TIME(`BeginDate`) < '05:00:00' ) AND YEAR(BeginDate) = 2015 AND BeginDate < EndDate -- GROUP BY DriverTransicsId, DATE_FORMAT(BeginDate, '%Y-%m') ORDER BY TIME_TO_SEC(TIMEDIFF(LEAST( EndDate, DATE(EndDate) + INTERVAL 5 HOUR), BeginDate)) desc 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date      15/12/2015
 * @version    0.1
 * @revision   $0$
 *
 * Calcul des heures de travail de nuit
 *
 * - A Faire : Relecture Nettoyage
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

function selectActivite($dbConn, $annee, $heuresNuit) {
	$borne = '05:00:00';
	$stmt = $dbConn->prepare( "SELECT"
							. " DriverTransicsId, DATE_FORMAT(BeginDate, '%m') AS Mois, DATE_FORMAT(BeginDate, '%Y-%m') AS AnMois,"
							. " COUNT(DISTINCT date(EndDate)) AS nbJours,"
							. " SUM( TIME_TO_SEC(TIMEDIFF(LEAST( EndDate, DATE(EndDate) + INTERVAL 5 HOUR ), BeginDate)) ) AS DureeSec,"
							. " SEC_TO_TIME( SUM( TIME_TO_SEC(TIMEDIFF(LEAST( EndDate, DATE(EndDate) + INTERVAL 5 HOUR ), BeginDate)) ) ) AS Duree"
							. " FROM t_km_parcourt"
							. " WHERE TIME(BeginDate) < '04:00:00' AND YEAR(BeginDate) = 2015 AND BeginDate < EndDate"
							. " GROUP BY DriverTransicsId, DATE_FORMAT(BeginDate, '%Y-%m')"
							. " ORDER BY DriverTransicsId, DATE_FORMAT(BeginDate, '%Y-%m')" );
							

	$stmt->execute( array( ) );
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	return $rows;
}

?>
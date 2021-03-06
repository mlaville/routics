<?php
/**
 * indexOR.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       03/05/2015
 * @version    0.6
 * @revision   $4$
 *
 * @date revision   01/08/2015 Affichage de la card du véhicle : vehicule-card
 * @date revision   08/09/2015 Revision de la mise en page css (flex-box)
 * @date revision   08/09/2015 Integration de la page Stat
 * @date revision   30/09/2015 Releves KM
 * @date revision   04/11/2015 Rapport consommation du jour
 * @date revision   16/02/2016 Recapitulatif des couts mensuels
 *
 * Gestion des ordres de réparation
 * 
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

session_name("flotte");
session_start();

if( !isset($_SESSION['ident']) ) {
	header("Location: ./");
}
/* Lecture des parametres pour l'affichage de l'entete */
$param = json_decode( file_get_contents( './custom/param.json') );
$dataUrlImg = $param->dataUrlImg;

$demo = isset($param->demo) ? $param->demo : false;
$ajaxVehicule = $demo ? './response/getVehicule.json' : './php/getVehicule.php';
$ajaxDetailVehicule = $demo ? './response/getDetailVehicule.json' : './php/getDetailVehicule.php';
$ajaxTrailers = $demo ? './response/getTrailers.json' : './php/getTrailers.php';
$ajaxKmCompteur = $demo ? './response/getKmCompteur.json' : './php/getKmCompteur.php';
?>
<!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
	<title>Routics - Véhicules</title>
	<link rel="stylesheet" type="text/css" href="./css/panel.css" />
<!--	<link rel="stylesheet" type="text/css" media="screen" href="http://lib.polinux.net/js/JQuery/ui/flick/jquery-ui-1.10.2.custom.css" /> -->
	<link rel="stylesheet" type="text/css" media="screen" href="http://localhost/jquery-ui-1.11.4.custom/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="http://lib.polinux.fr/js/month-picker/monthPicker.css" />	
    <link rel='stylesheet' href='css/px-layout.css'>
    <link rel="stylesheet" href="./css/bouton.css">
    <link rel="stylesheet" href="css/app-layout.css">
    <link rel="stylesheet" href="css/app-entete.css">
    <link rel="stylesheet" href="./css/form.css">
    <link rel="stylesheet" href="./css/listVehicule.css">
    <link rel="stylesheet" href="./css/table.css">
	<link rel="stylesheet" type="text/css" media="screen" href="./css/tableGenerator.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/marques.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/ajaxLoader.css" />
	
  </head>
<body data-vehicule="<?php echo $ajaxVehicule; ?>" data-trailers="<?php echo $ajaxTrailers; ?>" data-detail_vehicule="<?php echo $ajaxDetailVehicule; ?>" data-km_compteur="<?php echo $ajaxKmCompteur; ?>">
<input type="hidden" id="dataUrl" value="<?php echo $dataUrlImg; ?>" />
<header>
	<img src="./img/dossierOr.png" alt="Gestion des OR">
	<h2>Gestion des Ordres de Réparation</h2>
	<nav>
		<ul>
		<li><a href="#content">Saisie OR</a></li>
		<li><a href="#content-stat">Statistiques</a></li>
		<li><a href="#content-autoroute">Autoroute</a></li>
		<li><a href="#content-recap">Récapitulatif</a></li>
		<li>
			<?php echo $_SESSION['firstname'] . ' ' . $_SESSION['lastname']; ?>
			<a class="btn btn-primary" href="./php/deconnexion.php">Déconnexion</a>
		</li>
		</ul>
	</nav>
	<?php echo $param->header; ?>
</header>
<main style="display: none;">
	<audio id="clickSound">
		<source src="http://s1download-universal-soundbank.com/mp3/sounds/2040.mp3"></source>
		Audio not supported.
	</audio>
	<audio id="clickSound2">
		<source src="http://freesound.org/data/previews/66/66717_931655-lq.mp3"></source>
		Audio not supported.
	</audio>
	<div id="leftcolumn">
<!-- 			<a id="a_vehicule" href="#">Actualiser</a><br> -->

		<form name="form_nav">
			<input type="radio" checked="" name="typeElement" value="tracteur" id="rd-tracteur">
			<label for="rd-tracteur"><img src="./img/tracteur.png"></label>
			<input type="radio" name="typeElement" value="remorque" id="rd-remorque">
			<label for="rd-remorque"><img src="./img/citerne.png"></label>

			<input type="text" style="display: none;" placeholder="Recherche ..." id="search">

			<div id="div_vehicule">
				<ul id="ul_tracteur"></ul>
				<ul id="ul_remorque"></ul>
			</div>
		</form>
	</div>
	<section id="content">
		<div class="box">
			<form id="form-or" name="form-or">

				<fieldset id="fs_visu">

					<legend>
						<output name="num-parc" class="numParc" id="num-parc">104</output>
					</legend>
					<div>
						<figure id="vehicule-card">
							<div class="box">
								<output name="idTransics" class="idTransics" id="idTransics"></output></div>
							<div class="box marque">
								<output class="renault" name="marque"></output>
							</div>
							<div class="box">
								<output class="transport" name="transport"></output>
							</div>
							<div class="box">
								<output name="immat" class="immat"></output>
							</div>
						</figure>
						<figure>
							 <div class="cadran">
								<output name="km-vehicule" class="km"></output>
								<label>compteur</label>
								<fieldset class="releveJour">
									<output name="kmJour" class="km">km</output>
									<meter min="0" max="120.47" high="5" value="6"></meter>
									<output name="consoJour">cj</output>L
  									<meter min="0" max="60" low="0" high="30" optimum="25"></meter>
									<output name="moyenneJour">mj</output>L/100km
								</fieldset>
							</div>
						</figure>
						<figure id="position">
							<div>
								<div id="googleMap"></div>
								<div id="indication">
									<div class="localite"></div>
									<div class="destination"></div>
									<div class="pilote"></div>
									<div class="tracteur"></div>
									<div class="remorque"></div>
								</div>
							</div>
							<figcaption><output style="color: black;" name="dateInfoVehicule">Données collectées le ...</output></figcaption>
						</figure>
					</div>
				</fieldset>
				<fieldset>
					<legend>Saisie d'un Ordre de Réparation
						<output name="idOr" id="idOr" ></output>
					</legend>
					<div>
						<div>
							<label for="dateOR">Date<small>de l'OR</small></label>
							<input type="text" name="dateOR" id="dateOR" />

							<label for="kmOR">Km<small>.</small></label>
							<input type="text" name="kmOR" id="kmOR" />
							<div class="ajax-loader"></div>
							<br style="clear:both"/>

							<label for="lieuOR">Lieu<small>des Réparations</small></label>
							<input type="text" name="lieuOR" id="lieuOR" />

							<label for="numFactOR">N° Facture<small></small></label>
							<input type="text" name="numFactOR" id="numFactOR" />
							
							<label for="montantOR">Montant<small>€ HT</small></label>
							<input type="text" name="montantOR" id="montantOR" />
							
							<br style="clear:both" />
							<label for="description">Nature des Réparations</label>
							<textarea name="descriptOr" id="description"></textarea>

							<button class="btn btn-primary" name="validOr" type="submit">Enregistrer</button>
							<div class="ajax-loader"></div>
						</div>
						<figure id="vehicule-stat">
						  <div>
							<div>nombre d'interventions</div>
							<div><output name="orNb"></output></div>
						  </div>
						  <div>
							<div>Montant<br />total</div>
							<div><output class="orMt" name="orMt"></output></div>
						  </div>
						  <div>
							<div>Coût Kilométrique</div>
							<div><output class="coutKm" name="coutKm"></output></div>
						  </div>
						</figure>
					</div>
				</fieldset>
			</form>
      <div class="C">
		<table id="table-or" summary="Récatituletif des ORs">
			<thead>
				<tr>
					<th>N° OR</th>
					<th>Date</th>
					<th>Lieu</th>
					<th>N° Facture</th>
					<th>km</th>
					<th>Nature des Réparations</th>
					<th>Montant</th>
					<th></th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<td colspan="6" class="rounded-foot-left"><em>Totaux</em></td>
					<td></td>
					<td class="rounded-foot-right">&nbsp;</td>
				</tr>
			</tfoot>
			<tbody></tbody>
		</table>
	  </div>
    </div>
  </section>
	<section id="content-stat"  class="blocReponse">
		<h1>Statistiques</h1>
		<div class="box">
		<form id="form-stat" name="form-stat">
			<ul style="display:none">
				<li><a class="medium button blue" href="#">Mois Précédent</a></li>
				<li><a class="medium button blue" href="#">3 Mois Précédents</a></li>
				<li><a class="medium button blue" href="#">Trimestre Précédent</a></li>
			</ul>
			<fieldset><legend>Période</legend>
				<ul>
					<li>
						<label for="dateInf">Du</label>
						<input type="text" name="dateInf" id="dateInf" />
					</li>
					<li>
						<label for="dateSup">au</label>
						<input type="text" name="dateSup" id="dateSup" />
					</li>
				</ul>
			</fieldset>
			<fieldset><legend>Rupture</legend>
				<ul>
					<li>
						<input type="radio" name="rupture" id="rd_marque" checked />
						<label for="rd_marque"><p>Marque</p></label>
					</li>
					<li>
						<input type="radio" name="rupture" id="rd_transport" />
						<label for="rd_transport"><p>Transport</p></label>
					</li>
				</ul>
			</fieldset>
			<button class="btn btn-primary" name="calculStat" type="submit">Calculer ...</button>
			<div class="ajax-loader"></div>
			<fieldset class="listSelect"><legend>Imprimer ...</legend>
				<ul>
					<li>
						<button class="btn btn-primary" name="bt-impDetail">Détail</button>
					</li>
					<li>
						<button class="btn btn-primary" id="a_impSynthese" name="bt-impSynthese">Synthèse</button>
					</li>
				</ul>
			</fieldset>
		</form>
		</div>
		<div id="PreviewTableClassDiv" class="CSSTableGenerator">		
		<table summary="Récatituletif des ORs" id="table-stat" >
			<caption></caption>
			<thead>
				<tr>
					<th></th>
					<th colspan=3>Parc</th>
					<th colspan=2>Km Parcourus</th>
					<th>Nb OR</th>
					<th colspan=2>Coût Total</th>
					<th>Coût KM</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<td class="rounded-foot-left" colspan="4"><em></em></td>
					<td></td>
					<td class="rounded-foot-right">&nbsp;</td>
				</tr>
			</tfoot>
			<tbody></tbody>
		</table>
		</div>
  </section>
	<section id="content-km"  class="blocReponse" style="display: none">
		<form name="releve-km">
			<label>mois</label>
			<input type="text" name="moisRef" >
			<button class="btn btn-primary" name="calculKm" type="submit">Calculer</button>
		</form>
		<div id="PreviewTableClassDiv2" class="CSSTableGenerator">		
		<table summary="Relevé Kilomètrique" id="table-km" >
			<thead>
				<tr>
					<th>Véhicule</th>
					<th>Parc</th>
					<th>Date début</th>
					<th>km début</th>
					<th>Date fin</th>
					<th>km fin</th>
					<th>Km Parcourus</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<td class="rounded-foot-left" colspan="4"><em></em></td>
					<td></td>
					<td class="rounded-foot-right">&nbsp;</td>
				</tr>
			</tfoot>
			<tbody></tbody>
		</table>
		</div>
	</section>
	<section id="content-autoroute" class="blocReponse">
		<form name="uploadAutoroute">
		  <input type="file" name="fileElement" accept=".csv" />
		  <button name="fileSelect" class="btn btn-primary">Sélectionner un Fichier</button>
		</form>
		<div id="PreviewTableClassDiv3" class="CSSTableGenerator">		
		<label for="detailAutoroute">masquer le détail</label>
		<input type="checkbox" id="detailAutoroute" />
		<table summary="Relevé Autoroute" id="table-autoroute">
		  <caption>Relevé Autoroute</caption>
			<thead>
				<tr></tr>
			</thead>
			<tfoot>
				<tr>
					<td class="rounded-foot-left" colspan="4"><em></em></td>
					<td></td>
					<td class="rounded-foot-right">&nbsp;</td>
				</tr>
			</tfoot>
			<tbody></tbody>
		</table>
		</div>
	</section>

	<section id="content-recap" class="blocReponse">
<header>
		<form name="recapitulatif">
			<label>mois</label>
			<input type="text" name="moisRef" >
			<button class="btn btn-primary" name="calculResult" type="submit">Calculer</button>
			<div id="ajax-loader"></div>
			<button class="imprimer" id="btnImpCoutsMensuel"></button>
		</form>
</header>
		<div class="CSSTableGenerator">		

		<table summary="Recapitulatif" id="table-recapitulatif" >
		  <caption>Récapitulatif Tracteurs</caption>
			<thead>
				<tr>
					<th>Num Parc</th>
					<th>Immat.</th>
					<th>Type</th>
					<th>Chauffeur(s)</th>
					<th>CA
						<form name="uploadCA" enctype="multipart/form-data" method="post" >
							<input type="file" name="fileElement" accept=".xml" />
							<button name="fileSelect" class="btn btn-primary btn-uploadCA"></button>
						</form>
					</th>
					<th>Km<br/>Parcourus</th>
					<th>Terme Km</th>
					<th>Jours<br/>Travaillés</th>
					<th>CA Jour</th>
					<th>Autoroute<button id="chargeAutoroute" class="btn btn-primary" style="display: none">charge</button></th>
					<th>gasoil</th>
					<th>conso./100km</th>
					<th>Coûts<br/>Pneumatique<input type="text" value="0.01355" id="coefPneumatique" /></th>
					<th>Coûts Entretien</th>
					<th>Total coûts</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th>Num Parc</th>
					<th></th>
					<th></th>
					<th></th>
					<th>CA</th>
					<th>Km</th>
					<th>Terme Km</th>
					<th></th>
					<th>CA Jour</th>
					<th>Autoroute</th>
					<th>gasoil</th>
					<th>conso./100km</th>
					<th>Pneumatique</th>
					<th>Coûts Entretien</th>
					<th></th>
				</tr>
				<tr style="display: none">
					<td class="rounded-foot-left" colspan="4">
						<button class="btn btn-primary" id="btn-nelleLigne" >Ajouter un Tracteur</button>
					</td>
					<td></td>
					<td class="rounded-foot-right">&nbsp;</td>
				</tr>
			</tfoot>
			<tbody></tbody>
		</table>
		</div>
		<div style="display: none">
			<form name="modifRecap" id="modifRecap">
			  <label>Numéro de Parc</label><input type="text" value="" name="numParc" /><br />
			  <label>Immatriculation</label><input type="text" value="" name="immat" /><br />
			  <fieldset><legend>Chauffeur 1</legend>
				  <label>Nom</label><input type="text" value="" name="conduct1" /><br />
				  <label>Jours Travaillés</label><input type="text" value="" name="jourTravail1" /><br />
			  </fieldset>
			  <fieldset><legend>Chauffeur 2</legend>
				  <label>Nom</label><input type="text" value="" name="conduct2" /><br />
				  <label>Jours Travaillés</label><input type="text" value="" name="jourTravail2" /><br />
			  </fieldset>
			  <fieldset><legend>Chauffeur 3</legend>
				  <label>Nom</label><input type="text" value="" name="conduct3" /><br />
				  <label>Jours Travaillés</label><input type="text" value="" name="jourTravail3" /><br />
			  </fieldset>
			  <button class="btn btn-primary" id="btn-validLigne">Enregistrer</button>
			</form>
		</div>
	</section>

</main>
	<footer>
	  <a href="http://polinux.fr" target="_blank">
		<img alt="polinux.fr" src="http://lib.polinux.fr/img/polinux-micro.gif">
	  </a>
	</footer>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
	<script src="http://lib.polinux.net/js/JQuery/ui/jquery.ui.datepicker-fr.js" type="text/javascript"></script>
<!--	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js"></script> -->
	<script async defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAHCJvUwGSsJk4PuEoaUB6EYJ2ahIeqzn4&callback=initMap">
    </script>

	<!--		<script type="text/javascript" src="http://mrrio.github.io/jsPDF/dist/jspdf.min.js"></script> 
	<script type="text/javascript" src="./js/jspdf.debug.js"></script> -->
	<script type="text/javascript" src="http://lib.polinux.fr/js/jspdf.debug.js"></script>
	
	<script type="text/javascript" src="http://lib.polinux.fr/js/js-util.js"></script>
	<!--	<script type="text/javascript" src="./js/js-util.js"></script> -->
	<script type="text/javascript" src="http://lib.polinux.fr/js/month-picker/monthPicker.js"></script>
	<script type="text/javascript" src="./js/pdfStatOr.js"></script>
	<script type="text/javascript" src="./js/formOr.js"></script>
	<script type="text/javascript" src="./js/panel.js"></script>
	<script type="text/javascript" src="./js/statOr.js"></script>
	<script type="text/javascript" src="./js/formAutoroute.js"></script>
	<script type="text/javascript" src="./js/pdfCoutsMensuel.js"></script>
	<script type="text/javascript" src="./js/recapCouts.js"></script>
	<script type="text/javascript" src="./js/appOr.js"></script>
  </body>
</html>

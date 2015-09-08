<?php
/**
 * indexOR.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       03/05/2015
 * @version    0.5
 * @revision   $0$
 *
 * @date revision   01/08/2015 Affichage de la card du véhicle : vehicule-card
 * @date revision   08/09/2015 Revision de la mise en page css (flex-box)
 *
 * Gestion des ordres de réparation
 * 
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

session_name("flotte");
session_start();

if( !isset( $_SESSION['ident']) ) {
	header("Location: ./");
}
/* Lecture des parametres pour l'affichage de l'entete */
$param = json_decode( file_get_contents( './custom/param.json') );

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
    <link rel='stylesheet' href='css/px-layout.css'>
    <link rel="stylesheet" href="./css/bouton.css">
    <link rel="stylesheet" href="css/app-layout.css">
    <link rel="stylesheet" href="css/app-entete.css">
    <link rel="stylesheet" href="./css/form.css">
    <link rel="stylesheet" href="./css/listVehicule.css">
    <link rel="stylesheet" href="./css/table.css">
	<link rel="stylesheet" type="text/css" media="screen" href="./css/marques.css" />
  </head>
<body data-vehicule="<?php echo $ajaxVehicule; ?>" data-trailers="<?php echo $ajaxTrailers; ?>" data-detail_vehicule="<?php echo $ajaxDetailVehicule; ?>" data-km_compteur="<?php echo $ajaxKmCompteur; ?>">
<header>
	<img src="../img/dossierOr.png" alt="Gestion des OR">
	<h2>Gestion des Ordres de Réparation</h2>
	<nav>
		<form name="frm_menu">
			<ul>
			<li>
			<input type="radio" checked="" name="menu" id="rd-saisie">
			<label for="rd-saisie">Saisie OR</label>
			</li>
			<li>
			<input type="radio" name="menu" id="rd-stat">
			<label for="rd-stat"><a href="./indexStat.php">Statistiques</a></label>
			</li>
			<li>
				<?php echo $_SESSION['firstname'] . ' ' . $_SESSION['lastname']; ?>
				<a class="btn btn-primary" href="./php/deconnexion.php">Déconnexion</a>
			</li>
			</ul>
		</form>
	</nav>
	<?php echo $param->header; ?>
</header>
<main>
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
	<div id="content">
		<div class="box">
			<form id="form-or" name="form-or">
<!-- 				<h1>Saisie des Ordres de Réparation</h1> -->
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
							</div>
						</figure>
						<figure id="position">
							<div>
								<div id="googleMap"></div>
								<div id="indication">
									<div class="localite"></div>
									<div class="destination"></div>
								</div>
							</div>
							<figcaption><output style="color: black;" name="dateInfoVehicule">Données collectées le 8 septembre 2015 à 8h28</output></figcaption>
						</figure>
					</div>
									</fieldset>
				<fieldset>
					<legend>Saisie d'un Ordre de Réparation
						<output name="idOr" id="idOr" ></output>
					</legend>
					<div>
						<div>
							
							<label for="dateOR">Date
							<span class="small">de l'OR</span>
							</label>
							<input type="text" name="dateOR" id="dateOR" />

							<label for="kmOR">Km
							<span class="small">.</span>
							</label>
							<input type="text" name="kmOR" id="kmOR" />
							<div class="ajax-loader"></div>
							<br style="clear:both"/>

							<label for="lieuOR">Lieu
							<span class="small">des Réparations</span>
							</label>
							<input type="text" name="lieuOR" id="lieuOR" />

							<label for="numFactOR">N° Facture
							<span class="small"></span>
							</label>
							<input type="text" name="numFactOR" id="numFactOR" />
							
							<label for="montantOR">Montant
							<span class="small">€ HT</span>
							</label>
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
							<div>
							  <output name="orNb"></output>
							</div>
						  </div>
						  <div>
							<div>Montant total</div>
							<div>
							  <output class="orMt" name="orMt"></output>
							</div>
						  </div>
						  <div>
							<div>Coût Kilométrique</div>
							<div>
							  <output class="coutKm" name="coutKm"></output>
							</div>
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
  </div>
	<div id="content-stat">
		<form id="form-stat" name="form-stat">
			<h1>Statistiques</h1>
			<ul style="display:none">
				<li><a class="medium button blue" href="#">Mois Précédent</a></li>
				<li><a class="medium button blue" href="#">3 Mois Précédents</a></li>
				<li><a class="medium button blue" href="#">Trimestre Précédent</a></li>
			</ul>
			<fieldset class="listSelect"><legend>Période</legend>
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
			<fieldset class="listSelect"><legend>Rupture</legend>
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
			<button name="calculStat" type="submit">Calculer ...</button>
			<div class="ajax-loader"></div>
			<fieldset class="listSelect"><legend>Imprimer ...</legend>
				<ul>
					<li>
						<a href="#" id="a_impDetail">Détail</a>
					</li>
					<li>
						<a href="#" id="a_impSynthese">Synthèse</a>
					</li>
				</ul>
			</fieldset>
		</form>
		<div id="PreviewTableClassDiv" class="CSSTableGenerator">		
		<table summary="Récatituletif des ORs" id="table-stat" >
			<thead>
				<tr>
					<th></th>
					<th colspan=2>Parc</th>
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
	</div>

</main>
	<footer>
	  <a href="http://polinux.fr" target="_blank">
		<img alt="polinux.fr" src="http://lib.polinux.fr/img/polinux-micro.gif">
	  </a>
	</footer>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
	<script src="http://lib.polinux.net/js/JQuery/ui/jquery.ui.datepicker-fr.js" type="text/javascript"></script>
	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js"></script>
	
	<script src="http://lib.polinux.fr/js/js-util.js" type="text/javascript"></script>
	<script src="./js/appOr.js" type="text/javascript"></script>
	<script src="./js/formOr.js" type="text/javascript"></script>
  </body>
</html>

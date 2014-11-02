<?php
ini_set('session.gc_maxlifetime', 36000);
session_name("flotte");
session_start();

if( !isset( $_SESSION['ident'], $_SESSION['PersonExternalCode'] ) ) {
	header("Location: ./");
}
if( 'ADMIN' != $_SESSION['PersonExternalCode'] && strtolower($_SESSION['ident']) != 'polinux') {
	header("Location: ./");
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8" />
	<title>Routics - Relevés Mensuel d'Activité</title>
	<meta content="marc laville - polinux" name="author" />
	<meta content="Routics - Relevés d'Activité Mensuel" name="description" />
	
	<link rel="stylesheet" type="text/css" href="./css/px-layout.css" />
	<link rel="stylesheet" type="text/css" href="./css/layout.css" />
	<link rel="stylesheet" type="text/css" href="./css/ajaxLoader.css" />
	<link rel="stylesheet" type="text/css" href="./css/bouton.css" />
	<link rel="stylesheet" type="text/css" href="./css/workTime.css" />
	<link rel="stylesheet" type="text/css" href="./css/panel.css" />
    <link rel="stylesheet" type="text/css" href="./css/upload.css" />

	<script type="text/javascript" src="http://cdn.jsdelivr.net/jquery/2.1.1/jquery.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	<script type="text/javascript" src="http://lib.polinux.fr/js/jspdf.js"></script>
</head>
<body>
	<header>
			<img alt="Récapitulatif Mensuel" src="./img/wt.png">Récapitulatif Mensuel d'Activité Conducteur
			<ul>
				<li>
					<label for="input-mois">Mois</label>
					<input type="text" readonly="" id="input-mois">
				</li>
				<li>
					<fieldset>
					<legend><img src="./img/Highlighter_Yellow_Icon_16.png" /></legend>
					<div data-couleur="bgffff00" draggable="true" style="background:#ffff00;"></div>
					<div data-couleur="bgff00cc" draggable="true" style="background:#ff00cc;"></div>
					<div data-couleur="bg00ff66" draggable="true" style="background:#00ff66;"></div>
					<div data-couleur="bg" draggable="true" style="background:#fff;">x</div>
					</fieldset>
				</li>			
				<li>
					<fieldset>
					<legend><img src="./img/PenBlue.png" /></legend>
					<div data-couleur="ff0000" draggable="true" style="color:#ff0000;background:#fff;">A</div>
					<div data-couleur="000000" draggable="true" style="color:#000000;background:#fff;">A</div>
					<div data-couleur="FF7200" draggable="true" style="color:#FF7200;background:#fff;">A</div>
					<div data-couleur="" draggable="true" style="background:#fff;">x</div>
					</fieldset>
				</li>			
			</ul>
			<h3>bouquerod<p>pierre s.a.s.</p></h3>
			<nav>
			<div>
				<?php echo $_SESSION['firstname'] . ' ' . $_SESSION['lastname']; ?>
				<a href="./php/deconnexion.php">Déconnexion</a>
			</div>
			</nav>
	</header>
    <div id="wrapper">
        <div id="contentliquid">
		<div id="content">
			<div id="remonte">
				<h3>Récapitulatif Mensuel d'Activité Conducteur <strong id='date_titre'></strong></h3>
				<div class="datagrid">
					<form name='frm_tt'>
						<table summary="Relevé Activité" id="table-recap">
							<colgroup style="background-color:yellow; width:200px"></colgroup>
							<colgroup span="8" style="width:86x"></colgroup>
							<colgroup style="width:18px"></colgroup>
							<thead>
								<tr class=Fixable>
									<th>
										<span id='span-mois'>*</span>
										<span>
											
											<input type="checkbox" id="cb-codeOptiGest" />
											<label for="cb-codeOptiGest">OPTIGEST</label>
										</span>
									</th>
									<th>CONDUITE<br>DISQUE</th>
									<th>TA DISQUE</th>
									<th>TOTAL DISQUE</th>
									<th>TA REEL</th>
									<th>TOTAL REEL</th>
									<th>%<br>CONDUITE</th>
									<th>MODIF DISQUE</th>
									<th>%<br>CONDUITE</th>
									<th>-</th>
							   </tr>
							</thead>
							<tfoot>
								<tr style="display:none">
									<td rowspan=3>Total</td><td></td><td></td><td></td>
								</tr>
							</tfoot>
							<tbody></tbody>
						</table>
					</form>
				</div>
			</div>
			<div id="heuresDues" class="display-none">
				<h3>Gestion des Heures Dûes Conducteurs<strong id='date_titreheuresDues'></strong></h3>
				<div class="datagrid">
					<form name='frm_hd'>
						<table summary="Relevé Activité" id="table-hd">
							<colgroup style="background-color:yellow; width:128px"></colgroup>
							<colgroup span="13" style="width:72"></colgroup>
							<colgroup style="width:18px"></colgroup>
							<thead>
								<tr class="Fixable">
									<th rowspan="2"><div style="width:116px;"></div>
										<span id='span-mois-hd'>*</span></th>
									<th colspan="2">Solde mois précédent</th>
									<th rowspan="2"><div style="width:51px;">Prix de l'Heure Disque</div></th>
									<th colspan="3">Dues par bouquerod</th>
									<th colspan="2">Total</th>
									<th colspan="2">Dues par chauffeur</th>
									<th colspan="3">Prime</th>
									<th colspan="2">Solde</th>
									<th>Prime</th>
									<th>-</th>
							   </tr>
								<tr class=Fixable style="font-size: 10px">
									<th><div style="width:51px;;">Heures</div></th>
									<th><div style="width:51px;;">Montant</div></th>
									<th><div style="width:32px;">Hrs</div></th>
									<th><div style="width:32px;">Ajust.</div></th>
									<th><div style="width:51px;;">Montant</div></th>
									<th><div style="width:48px;">Hrs</div></th>
									<th><div style="width:51px;;">Montant</div></th>
									<th><div style="width:32px;">Heures</div></th>
									<th><div style="width:51px;;">Montant</div></th>
									<th><div style="width:51px;;">Montant</div></th>
									<th><div style="width:51px;;">Montant</div></th>
									<th><div style="width:51px;;">Montant</div></th>
									<th><div style="36px;">Heures</div></th>
									<th><div style="width:51px;;">Montant</div></th>
									<th><div style="width:51px;;"> a+b</div></th>
									<th>-</th>
							   </tr>
							</thead>
							<tfoot>
								<tr style="display:none">
									<td rowspan=3>Total</td><td></td><td></td><td></td>
								</tr>
							</tfoot>
							<tbody id="tbody_hrDues"></tbody>
						</table>
					</form>
				</div>
			</div>
	   </div>
	   </div>
        <div id='leftcolumn'>
			<nav>
				<ul>
					<li>
						<input type="radio" name="rd_nav" id="rd_nav_releve" checked />
						<label for="rd_nav_releve" >Relevés Mensuels</label>
						<div>
							<form id="upload_form" enctype="multipart/form-data" method="post" action="upload.php">
							
								<input id="uploadFile" placeholder="Pas de Fichier sélectionné" disabled="disabled" />
								<div class="fileUpload btn btn-primary">
									<div><label for="image_file">Sélectionner ...</label></div>
									<div><input type="file" name="image_file" id="image_file" class="upload" onchange="fileSelected();" /></div>
								</div>
								<div>
									<input type="button" value="Traiter le Fichier" onclick="startUploading()" />
								</div>
								<div id="fileinfo">
									<div id="filename"></div>
									<div id="filesize"></div>
									<div id="filetype"></div>
									<div id="filedim"></div>
								</div>
								<div id="error">You should select valid image files only!</div>
								<div id="error2">Une erreur est survenue pendant le chargement du Fichier</div>
								<div id="abort">Le téléchargement a été stoppé par l'utilisateur, ou bien le navigateur a perdu la connection</div>
								<div id="warnsize">Your file is very big. We can't accept it. Please select more small file</div>

								<div id="progress_info">
									<div id="progress"></div>
									<div id="progress_percent">&nbsp;</div>
									<div class="clear_both"></div>
									<div>
										<div id="speed">&nbsp;</div>
										<div id="remaining">&nbsp;</div>
										<div id="b_transfered">&nbsp;</div>
										<div class="clear_both"></div>
									</div>
									<div id="upload_response"></div>
								</div>
							</form>

							<img id="preview" />
							<button id='bt_enregistrer' class='btn'>Enregistrer</button><div id="ajax-loader"></div>
							<button id='btn_impRecap' class='btn btn-imprimer'></button>
						</div>
					</li>
					<li>
						<input type="radio" name="rd_nav" id="rd_nav_heureDues" />
						<label for="rd_nav_heureDues" >Heure Dues</label>
						<div >
							<button id='bt_enregHrDues' class='btn'>Enregistrer</button><div id="ajax-loader"></div>
							<button  id='btn_impHeuresDues' class='btn btn-imprimer'></button>
						</div>
					</li>
				</ul>
			</nav>
       </div>
    </div>

	<footer>
		<a target="_blank" href="http://www.polinux.fr">
			<img src="http://lib.polinux.fr/img/polinux-micro.gif" alt="www.polinux.fr" />
		</a>
	</footer><!-- #footer -->
<script type="text/javascript" src="http://lib.polinux.net/js/js-util.js"></script>
	<script type="text/javascript" src="./js/panel.js"></script>
	<script type="text/javascript" src="./js/pdfRecapMensuel.js"></script>
	<script type="text/javascript" src="./js/pdfHeuresDues.js"></script>
	<script type="text/javascript" src="./js/workTime.js"></script>
    <script type="text/javascript" src="./js/ajaxUpload.js"></script>
</body>
</html>
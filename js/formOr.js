/**
 * formOr.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       18/03/2015
 * @version    0.5
 * @revision   $0$
 *
 * Gestion des ordres de réparation
 * 
 * Appel  ajax:
 * - ../php/crudOR.php
 * - ./php/getDetailVehicule.php
 * - ./php/getKmCompteur.php
 *
 * Note : les appels getVehicule et getTrailers sont parametrés par le dataset de document.body
 *
 * A Faire
 * - gerer les requetes ajax sans JQuery
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

 function clicklistVehicle( a ) {
	var spans = a.querySelectorAll('span'),
		idTransics = a.querySelector('.idTransics').textContent,
		numParc = spans[1].textContent,
		li = a.parentNode,
		listLi = li.parentNode.getElementsByTagName('li'),
		cmptLi = listLi.length;
		
	// Affichage du logo dans la legende du fieldset
	document.getElementById('img-typeElement').setAttribute("src", ( AppOr.typeVehicule == 0 ) ? "./img/tracteur.png" : "./img/citerne.png");
	
	document.getElementById('idTransics').textContent = idTransics;
	document.getElementById('num-parc').value = numParc;
	document.getElementById('immat').textContent = spans[2].textContent;
	document.getElementById('km-vehicule').textContent = spans[3].textContent;
	figcaption = document.getElementById('km-vehicule').parentNode.getElementsByTagName('figcaption')[0];
	figcaption.textContent = ( document.forms["frm_nav"].typeElement[0].checked ) ? 'compteur' : 'parcourus';
	
	document.getElementById('fs_visu').style.opacity = 1;

	// Vide le formulaire de saisie
	afficheOr( null );
	
	// "marquage" du véhicule séléctionné
	for (var i = 0 ; i < cmptLi ; i++) {
		var liCourrant = listLi[i];
		if ( liCourrant == li ) {
			liCourrant.classList.add("selected");
		} else {
			liCourrant.classList.remove("selected");
		}
	}
	
	document.getElementById('marque').textContent = '';
//	$.post("./php/getDetailVehicule.php",
	$.post( document.body.dataset.detail_vehicule,
		{ "typeVehicule": AppOr.typeVehicule, "idVehicule": idTransics },
		function(data){
			if(data.success) {
				document.getElementById('marque').textContent = data.marque;
			}
	}, "json");
	
	// Affichage des saisie d'OR
	listOrVehicule( numParc )

	return idTransics;
}


function afficheOr( unOr ) {
	var f = document.forms["form-or"];
	
	if(unOr == null){
		// Vide le formulaire de saisie
		[ f["idOr"], f["dateOR"], f["kmOR"], f["lieuOR"], f["numFactOR"], f["montantOR"], f["descriptOr"] ]
			.forEach( function( el ) { el.value = '' } );
	} else {
		f["idOr"].value = unOr.IdOR;
		f["dateOR"].value = unOr.or_date;
		f["kmOR"].value = unOr.or_km;
		f["lieuOR"].value = unOr.or_prestataire;
		f["numFactOR"].value = unOr.or_numFacture;
		f["montantOR"].value = unOr.or_montant;
		f["descriptOr"].value = unOr.or_description;
	}
	return;
}

function afficheListOr( unTab, htmlTable ) {

	var tbody = htmlTable.getElementsByTagName('tbody')[0],
		tfoot = htmlTable.getElementsByTagName('tfoot')[0],
		tot = 0,
		addOr = function( unOr ) {
			var trOr = tbody.appendChild( document.createElement('tr') ),
				tdAction = document.createElement('td'),
				aEdit = tdAction.appendChild( document.createElement('a') ),
				aSup = tdAction.appendChild( document.createElement('a') ),
				deleteOr = function( e ) {
					var tds = trOr.getElementsByTagName('td');
					
					if( confirm( "Supprimer l'Ordre de Réparation ?\n\n" + tds[5].textContent ) ){
					/* Recherche l'Id de la ligne */
						supprimeOr( tds[0].textContent );
					}
					return;
				}
				editOr = function( e ) {
					var tds = trOr.getElementsByTagName('td');
					
					return afficheOr( {"IdOR" : tds[0].textContent,
							"or_date" : tds[1].textContent,
							"or_km" : tds[4].textContent,
							"or_prestataire" : tds[2].textContent,
							"or_numFacture" : tds[3].textContent,
							"or_description" : tds[5].textContent,
							"or_montant" : tds[6].textContent
					} );
				},
				addTd = function( lib ) {
					 return trOr.appendChild( document.createElement('td') ).textContent = lib;
				};
			
			aEdit.setAttribute('href', "#");
			aEdit.addEventListener('click', editOr);
			
			aSup.setAttribute('href', "#");
			aSup.addEventListener( 'click', deleteOr );
		
			[unOr.IdOR, unOr.or_date, unOr.or_prestataire, unOr.or_numFacture, unOr.or_km, unOr.or_description, unOr.or_montant].forEach(addTd)

			trOr.appendChild( tdAction );
			
			tot += unOr.or_montant * 100;
		};
		
	// retire tous les enfants d'un élément
	while (tbody.firstChild) {
	  tbody.removeChild(tbody.firstChild);
	};
	
	unTab.forEach(addOr);

	trfoot = tfoot.getElementsByTagName('tr')[0];
	trfoot.getElementsByTagName('td')[1].textContent = ( tot > 0 ) ? tot / 100 : '';
	
	return;
}

function listOrVehicule( unNumParc ) {
	$.post("./php/crudOR.php", { cmd: 'load', idVehicule: unNumParc },
		function(data){
			afficheListOr( data.result, document.getElementById('table-or') );
	}, "json");
	
	return;
}

//
// Validation des saisie
//
function validOr(f){

	var param = { idVehicule: f["num-parc"].value,
				idTransics: f["idTransics"].value,
				dateOR: f["dateOR"].value,
				kmOR: f["kmOR"].value,
				lieuOR: f["lieuOR"].value,
				numFactOR: f["numFactOR"].value,
				montantOR: f["montantOR"].value,
				descriptOr: f["descriptOr"].value
			},
		idOr = f["idOr"].value;
			
	f["validOr"].disable = true;
		
	if( idOr > 0 ) {
		param["cmd"] = 'update';
		param["idOr"] = idOr;
	} else {
		param["cmd"] = 'create';
	}

	$.post("./php/crudOR.php", param,
		function(d){
			listOrVehicule( param.idVehicule );
			afficheOr( null );
			f["validOr"].disable = false;
	}, "json");

	return false;
}

function supprimeOr( unIdentOr ){

	var param = { cmd: 'delete', idOr: unIdentOr };

	$.post("./php/crudOR.php", param,
		function(d){
			listOrVehicule( document.getElementById('num-parc').textContent );
	}, "json");

	return false;
}


window.addEventListener('load', function() {

    document.getElementById('a_vehicule').addEventListener('click', function() {
		loadVehicules( )
    });

	document.forms["frm_nav"].addEventListener('change', function(e) {
		return switchVehicle( this.typeElement );
	});
	
	$( "#dateOR" ).datepicker({
		onSelect: function(dateText, inst) {
			var noeud = document.getElementById('kmOR'),
				ajaxLoad = noeud.nextSibling;
			
			noeud.value = '';
			while( ajaxLoad.nodeName != 'DIV' ){
				ajaxLoad = ajaxLoad.nextSibling;
			};
			ajaxLoad.style.display = 'inline-block';
		
			if( document.forms["frm_nav"].typeElement[0].checked ) {
			
//				$.post("./php/getKmCompteur.php", {
				$.post(document.body.dataset.km_compteur, {
						"idVehicule": document.getElementById('idTransics').value,
						"dateOr": dateText 
					},
					function(data){
						
						ajaxLoad.style.display = 'none';
						noeud.value = data.km;
						
						if(data.km != null) {
							do {
								noeud = noeud.previousSibling;
							} while(noeud.nodeType != Node.ELEMENT_NODE);
							noeud.getElementsByTagName('span')[0].textContent = 'compteur';
						} else {
						}
						return;
					}, "json"
				);
			} else {
				$.post("./php/selectKmParcourus.php", {
						"numParc": document.getElementById('num-parc').value,
						"dateOr": dateText 
					},
					function(data){

						ajaxLoad.style.display = 'none';
						noeud.value = data.result.KmParcourus;
						do {
							noeud = noeud.previousSibling;
						} while(noeud.nodeType != Node.ELEMENT_NODE);
						noeud.getElementsByTagName('span')[0].textContent = 'parcourus depuis le ' + data.result.DateInit;
						
						return;
					}, "json"
				);
			}
			document.forms["form-or"]["lieuOR"].focus();
			
		}
	});
	
	document.forms["form-or"].addEventListener("keypress", 
		function(e){
			if(e.keyCode==13) {
				var noeud = e.target.nextSibling,
					nextInput = false;
				
				e.preventDefault();
				while( !nextInput ) {
					noeud = noeud.nextSibling;
					if( noeud.nodeName == 'INPUT' || noeud.nodeName == 'TEXTAREA' ) {
						noeud.focus();
						nextInput = true;
					}
				};
			}
		},
		false
	);
	document.forms["form-or"].addEventListener('submit', function(event) {
		event.preventDefault();
		
		return validOr( event.target );
	});

	loadVehicules( );
	switchVehicle( document.forms["frm_nav"].typeElement );
	
	return;
});

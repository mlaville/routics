/**
 * appOr.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       03/05/2015
 * @version    0.5.1
 * @revision   $0$
 *
 * Gestion des ordres de réparation
 * 
 * @date revision   01/08/2015 Affichage de la card du véhicule
 * @date revision   25/08/2015 Transfere la gestion de la googlemap dans dormOr.js
 * @date revision   13/09/2015 Gere la totalité de evenement load de window.
 * @date revision   24/09/2015 Redirige les boutons d'édition pour generer le PDF grace à jsPdf
 * @date revision   30/09/2015 relevés KM
 *
 * Appel  ajax:
 * - ./php/getVehicule.php
 * - ./php/getTrailers.php
 *
 * Note : les appels getVehicule et getTrailers sont parametrés par le dataset de document.body
 *
 * A Faire
 * - gerer les requetes ajax sans JQuery
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
var AppOr = {
		typeVehicule : 0,
		vehicule : null
};

// VehicleView
function loadVehicules( ) {
	var ajoutVehicule = function ( objet, unUl ) {
			var	li_vehicule = document.createElement("li"),
				label_vehicule = li_vehicule.appendChild( document.createElement("label") ),
				input_select = label_vehicule.appendChild( document.createElement("input") ),
				span_idTransics = document.createElement("span"),
				span_numParc = document.createElement("span"),
				span_immat = document.createElement("span"),
				div_km = document.createElement("span");
				
			span_idTransics.classList.add("idTransics");
			span_idTransics.textContent = objet.VehicleTransicsID;
			
			span_numParc.classList.add("numParc");
			span_numParc.textContent = objet.VehicleID;
				
			span_immat.textContent = objet.LicensePlate;
			
			div_km.classList.add("km");
			div_km.textContent = ("000000" + objet.CurrentKms).substr(-7);
			
			input_select.setAttribute('type', 'radio')
			input_select.setAttribute( 'name', ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque' )
			
			label_vehicule.appendChild(span_idTransics);
			label_vehicule.appendChild(span_numParc);
			label_vehicule.appendChild(span_immat);
			label_vehicule.appendChild(div_km);
			input_select.addEventListener('change', function(e) {
				ctrlFormVehicule.afficheVehicle( objet.VehicleTransicsID, objet.VehicleID, objet.LicensePlate, objet.CurrentKms );
		    });
		   
			return unUl.appendChild(li_vehicule);
		},
		ajoutTracteur = function( objet ) {
			return ajoutVehicule( objet, document.getElementById('ul_tracteur') );
		},
		ajoutRemorque = function ( objet ) {
			return ajoutVehicule( objet, document.getElementById('ul_remorque') );
		}

//	$.post("./php/getVehicule.php", { },
	$.post( document.body.dataset.vehicule, { },
		function(data){
			data.result.forEach( ajoutTracteur );
	}, "json");
	
//	$.post("./php/getTrailers.php", { },
	$.post( document.body.dataset.trailers, { },
		function(data){
			data.result.forEach( ajoutRemorque );
	}, "json");
	
	return;
}

function switchVehicle( rd ) {
	var i,
		val = rd.value;

	for( i = 0 ; i < rd.length ; i++ ) {
		if( rd[i].checked ) {
			AppOr.typeVehicule = i;
		}
	}

	return false;
}

window.addEventListener('load', function() {
	var formOr = document.forms["form-or"],
		formStat = document.forms["form-stat"],
		headerNav = document.querySelectorAll('header nav li a'),
		i,
		activeLink = function() {
			var i = 0,
				loc = window.location,
				link;
			
			for( i = 0 ; i < headerNav.length ; i++ ) {
				link = headerNav[i];
				
				if( [ loc.pathname, loc.href, loc.hash ].indexOf( link.getAttribute('href') ) > -1 ) {
					link.classList.add('active');
				} else {
					link.classList.remove('active');
				}
			}
		},

		selectDate = function(dateText, inst) {
			var noeud = formOr.kmOR,
				ajaxLoad = noeud.nextElementSibling;

			ajaxLoad.style.display = 'inline-block';
		
			if( document.forms["form_nav"].typeElement[0].checked ) {
			
//				$.post("./php/getKmCompteur.php", {
				$.post(document.body.dataset.km_compteur, {
						"idVehicule": document.getElementById('idTransics').value,
						"dateOr": dateText 
					},
					function(data){
						
						ajaxLoad.style.display = 'none';
						noeud.value = data.km;
						
						if(data.km != null) {
							noeud.previousElementSibling.getElementsByTagName('span')[0].textContent = 'compteur';
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
						noeud.previousElementSibling.getElementsByTagName('span')[0].textContent = 'parcourus depuis le ' + data.result.DateInit;
						
						return;
					}, "json"
				);
			}
			
			return formOr.lieuOR.focus();
		},
		dateRef = new Date(),
		formKm = document.forms['releve-km'],
		inputMois = formKm.moisReleve;

	posVehicule.marker = new google.maps.Marker( { position: new google.maps.LatLng(47.021750000, 5.71455), map: posVehicule.carte  } );

	document.forms["form_nav"].addEventListener('change', function(e) {
		return switchVehicle( this.typeElement );
	});
	
	$( "#dateOR" ).datepicker({
		onSelect: selectDate
	});
	
	formOr.addEventListener("keypress", 
		function(e){
			var elmt = e.target.nextElementSibling,
				nextInput = false;
				
			if(e.keyCode == 13) {
				e.preventDefault();
				while( !nextInput ) {
					elmt = elmt.nextElementSibling;
					if( ['INPUT', 'TEXTAREA'].indexOf(elmt.nodeName) > -1 ) {
						elmt.focus();
						nextInput = true;
					}
				};
			}
		},
		false
	);
	
	headerNav[0].click();
	document.querySelector('main').style.removeProperty('display');
	loadVehicules( );

	/* Attache un datePicker aus champs date */
	/* et initilisation au mois passé */
	dateRef.setDate(1);
	
	$( "#dateInf" ).datepicker({
		defaultDate: "-1m",
		changeMonth: true,
		onClose: function( selectedDate ) {
			$( "#dateSup" ).datepicker( "option", "minDate", selectedDate );
		}
	});
	$( "#dateSup" ).datepicker({
		defaultDate: "-1m",
		changeMonth: true,
		onClose: function( selectedDate ) {
			$( "#dateInf" ).datepicker( "option", "maxDate", selectedDate );
		}
	});

	/**
	 * Formulaire de saisie des OR
	 */
	formStat.addEventListener('submit', afficheStat);
	
    formStat['bt-impDetail'].addEventListener('click', function(e) {
		e.preventDefault();
		return domFenetrePdf( pdfStat( document.getElementById('table-stat'), false ), 'Coûts Kilomètriques' );
    });
	
    formStat['bt-impSynthese'].addEventListener('click', function(e) {
		e.preventDefault();
		return domFenetrePdf( pdfStat( document.getElementById('table-stat'), true ), 'Coûts Kilomètriques' );
    });

	 
	window.addEventListener("hashchange", activeLink, false);

	/**
	 * Releve KM
	 */
	formKm.addEventListener('submit', afficheReleveKm);
	 
 	dateRef = new Date();
 	dateRef.setMonth( dateRef.getMonth() - 1 );
	inputMois.value = [ ( '0' + ( dateRef.getMonth() + 1 ) ).slice(-2), dateRef.getFullYear() ].join('/');
	monthPickerFactory.createMonthPicker( inputMois );

	return;
});

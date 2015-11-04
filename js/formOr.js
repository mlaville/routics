/**
 * formOr.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       18/03/2015
 * @version    0.7
 * @revision   $0$
 *
 * Gestion des ordres de réparation
 * 
 * @date revision   01/08/2015 Affichage de la card du véhicule
 * @date revision   25/08/2015 Gestion de la sélection dans la liste de véhicule par des input radio
 * @date revision   14/09/2015 Remplace les liens de la table des OR par des boutons
 * @date revision   21/10/2015 passage de la table des OR en paramêtre
 * @date revision   04/11/2015 Rapport consommation du jour
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

 var posVehicule;
 function initMap() {

	posVehicule = {
		carte: new google.maps.Map(
			document.getElementById("googleMap"), {
				center: new google.maps.LatLng(46.680184, 5.5803363),
				zoom:12,
				mapTypeId:google.maps.MapTypeId.ROADMAP
		}),
		marker : null,
		changePos : function( pos ) {
			
			posVehicule.carte.panTo( pos );
			
			return posVehicule.marker.setPosition( pos );
		}
	};
};

var ctrlFormVehicule = (function (formVehicule, tableOR) {

	var	afficheOr = function( unOr ) {
			if(unOr == null){
				// Vide le formulaire de saisie
				[ formVehicule.idOr,
				  formVehicule.dateOR,
				  formVehicule.kmOR,
				  formVehicule.lieuOR,
				  formVehicule.numFactOR,
				  formVehicule.montantOR,
				  formVehicule.descriptOr
				].forEach( function( el ) { el.value = '' } );
				
			} else {
				formVehicule.idOr.value = unOr.IdOR;
				formVehicule.dateOR.value = unOr.or_date;
				formVehicule.kmOR.value = unOr.or_km;
				formVehicule.lieuOR.value = unOr.or_prestataire;
				formVehicule.numFactOR.value = unOr.or_numFacture;
				formVehicule.montantOR.value = unOr.or_montant;
				formVehicule.descriptOr.value = unOr.or_description;
			}
			return;
		},
		validOr = function(f){
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
		},
		supprimeOr = function( unIdentOr ){

			return $.post("./php/crudOR.php", { cmd: 'delete', idOr: unIdentOr },
				function(d){
					listOrVehicule( formVehicule["num-parc"].value );
			}, "json");
		},
		afficheListOr = function ( unTab ) {
			var tbody = tableOR.getElementsByTagName('tbody')[0],
				tfoot = tableOR.getElementsByTagName('tfoot')[0],
				tot = 0,
				/**
				  * Ajout d'une ligne au tableau des ORs
				  */
				addOr = function( unOr ) {
					var trOr = tbody.appendChild( document.createElement('tr') ),
						tdAction = document.createElement('td'),
						btEdit = tdAction.appendChild( document.createElement('button') ),
						btSup = tdAction.appendChild( document.createElement('button') ),

						deleteOr = function( e ) {
							var tds = trOr.getElementsByTagName('td');
							
							if( confirm( "Supprimer l'Ordre de Réparation ?\n\n" + tds[5].textContent ) ){
							/* Recherche l'Id de la ligne */
								supprimeOr( tds[0].textContent );
							}
							return;
						},
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
					
					btEdit.addEventListener('click', editOr);
					btSup.addEventListener( 'click', deleteOr );
				
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
			
			formVehicule.orNb.textContent = unTab.length;
			if( tot > 0 ){
				formVehicule.orMt.textContent = (tot / 100).toFixed(2);
				formVehicule.coutKm.textContent = ( tot / formVehicule['km-vehicule'].value / 100 ).toFixed(7);
			} else {
				formVehicule.orMt.textContent = '';
				formVehicule.coutKm.textContent = '';
			}
			return;
		},
	
		listOrVehicule = function( unNumParc ) {
			$.post("./php/crudOR.php", { cmd: 'load', idVehicule: unNumParc },
				function(data){
					afficheListOr( data.result );
			}, "json");
			
			return;
		},
		afficheVehicle = function( idTransics, numParc, immat, kmVehicule ) {
			
			var	formVehicule = document.forms['form-or'],
				champMarque = formVehicule.marque,
				outputKmVehicule = formVehicule['km-vehicule'],
				labelKm = outputKmVehicule.nextElementSibling,
				outputDateInfo = formVehicule.dateInfoVehicule,
				divLocalite = formVehicule.querySelector('.localite'),
				divDestination = formVehicule.querySelector('.destination'),
				divRemorque = formVehicule.querySelector('.remorque'),
				divPilote = formVehicule.querySelector('.pilote'),
				// Traite une chaine de la forme : 0.3km N De Besain
				formatPosition = function (str) {
					var reg = /([0-9]*)\.([0-9]*)km\s[N|E|O|S|\s]*De\s(\b.*\b)/ig,
						match = reg.exec(str);
					
					return match == null ? '' : '<span>' + match[3] + '</span><span>' + match[1] + ',' + match[2] + ' </span>';
				},
				formatDate = function (uneDate) {
				  var dateTimeFormat = new Intl.DateTimeFormat( 'fr', { year: "numeric", month: "long", day: "numeric"} );
				  
				  return dateTimeFormat.format(uneDate) + ' à ' + uneDate.getHours() + 'h' + uneDate.getMinutes().toString().lpad( '0', 2 );
				},
				/* {"success":true,
					"CurrentKms":335933,
					"marque":"RENAULT",
					"transport":"BOUQUEROD\/CIMENT\/TXMAX",
					"Category":"BulkTransport"
				 }
				*/
				showDetailVehicle = function(data){
						var marque = data.marque,
							position = data.position,
							dateModif = Date.fromISO(data.dateModif),
							dummy;
							
						champMarque.textContent = marque;
						champMarque.className = marque.toLowerCase();
						
						formVehicule.transport.textContent = [ data.transport, data.Category ].join(' / ');
						
						
						if( data.conso.ConsumptionReportItems ){
								dummy = data.conso.ConsumptionReportItems.ConsumptionReportItem;
								
								formVehicule.kmJour.textContent = dummy.Distance.toString().lpad( '0', 5 );
								formVehicule.consoJour.textContent = dummy.Consumption_Total;
								
								formVehicule.consoJour.previousElementSibling.value = dummy.Consumption_Idle;
								formVehicule.consoJour.previousElementSibling.max = dummy.Consumption_Total;
								
								formVehicule.moyenneJour.textContent = dummy.Consumption_Total_Avg.toFixed(2);
								
								formVehicule.moyenneJour.previousElementSibling.value = dummy.Consumption_Total_Avg;
						}
						
						outputKmVehicule.textContent = data.CurrentKms.toString().lpad( '0', 7 );
						
						posVehicule.changePos( new google.maps.LatLng( +position.Latitude, +position.Longitude ) );
						divLocalite.innerHTML = formatPosition(position.DistanceFromLargeCity);
						divDestination.innerHTML = formatPosition( position.DistanceFromPointOfInterest.toLowerCase() );
						
						divRemorque.innerHTML = data.Trailer ? data.Trailer.FormattedName + '<br/>' + data.Trailer.Filter : '';
						divPilote.innerHTML = data.Driver ? data.Driver.FormattedName.toLowerCase() : '';

						outputDateInfo.textContent = (data.dateModif) ? 'Données collectées le ' + formatDate( dateModif ) : '';
						outputDateInfo.style.color = ( dateModif.diff() > 48 * 3600 * 1000) ? 'red' : 'black';
						
						document.getElementById('fs_visu').style.opacity = 1;
						
						// Affichage des saisie d'OR
						listOrVehicule( formVehicule['num-parc'].value );
					
					return;
				};
				
			// Affichage du logo dans la legende du fieldset
			document.getElementById('fs_visu').className = ['tracteur', 'remorque'][AppOr.typeVehicule];
			document.getElementById('fs_visu').style.opacity = .2;
			
			formVehicule.idTransics.textContent = idTransics;
			document.getElementById('num-parc').value = numParc;
			formVehicule.immat.textContent = immat;
//			outputKmVehicule.textContent = kmVehicule;
			labelKm.textContent = ( document.forms["form_nav"].typeElement[0].checked ) ? 'compteur' : 'parcourus';

			// Vide le formulaire de saisie
			afficheOr( null );
			
			champMarque.textContent = '';
			champMarque.className = '';
		
			$.post( document.body.dataset.detail_vehicule, //	$.post("./php/getDetailVehicule.php",
				{ "typeVehicule": AppOr.typeVehicule, "idVehicule": idTransics },
				function(dataDetail) {
					if(dataDetail.success) {
						showDetailVehicle(dataDetail);
					}
					return dataDetail.success;
				},
				"json"
			);

			return idTransics;
		}
	
	formVehicule.addEventListener('submit', function(event) {
		event.preventDefault();
		
		return validOr( event.target );
	});
	
	return { afficheVehicle: afficheVehicle };
	
})( document.forms["form-or"], document.getElementById('table-or') );


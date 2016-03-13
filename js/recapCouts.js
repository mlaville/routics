/**
 * recapCouts.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       20/10/2015
 * @version    0.5
 * @revision   $0$
 *
 * Affichage du récapitulatif des couts de la flotte
 *
 * @date revision 10/01/2016 Ajout de l'immatriculation
 * @date revision 23/01/2016 Gestion des upload ca et autoroute
 * @date revision 03/02/2016 Calcul des totaux par ligne
 * @date revision 22/02/2016 Gere le bouton d'edition (btnImpCoutsMensuel)
 * @date revision 24/02/2016 Gere les mises à jour des CA
 * @date revision 01/03/2016 use strict
 *
 * Appel  ajax:
 * - ./php/getStatVehicles.php
 * - ./services/parc/updateCA
 *
 * A Faire
 * - Ligne des totaux
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

ctrlRecapCouts = function( formRecap, formCA, inputCoef, tableResult ) {
	'use strict';
	
	var btCalcul = formRecap.calculResult,
		btnImpCoutsMensuel = document.getElementById('btnImpCoutsMensuel'),
		moisRef = function() {
			var arrMois = formRecap.moisRef.value.split('/');

			return arrMois[1] + arrMois[0].lpad('0', 2);
		},
		libMoisRef = function() {
			var arrMois = formRecap.moisRef.value.split('/'),
				monthNames = Date.monthNames();
			
			return [ monthNames[ arrMois[0] - 1 ], arrMois[1] ].join(' ');
		},
		fileElement = formCA.fileElement,
		xhrRecapCout = new XMLHttpRequest(),
		recalcLigne = function( trTract, coef ) {
			var listTd = trTract.getElementsByTagName('td'),
				kmParcourt = Number(listTd[5].textContent),
				coutPneu = (coef > 0) ? coef * kmParcourt : 0,
				tot = coutPneu + Number(listTd[13].textContent);
			
			listTd[8].textContent = ( listTd[4].firstChild.value / listTd[7].textContent).toFixed(2);
			listTd[11].textContent = ( 100 * listTd[10].firstChild.value / kmParcourt ).toFixed(2);
			listTd[12].textContent = (coutPneu > 0) ? coutPneu.toFixed(2) : ''; // cout pneumatique
			listTd[14].textContent = tot.toFixed(2);

			return;
		},
		recalcTbody = function( ) {
			var coef = 1 * inputCoef.value,
				collecTr = tableResult.querySelectorAll('tbody tr'),
				idTr = collecTr.length;
				
			while(idTr > 0){
				idTr--;
				recalcLigne( collecTr[idTr], coef );
			}
			
			return;
		},
		listResult = function( objParc ) {
			var tbody = tableResult.getElementsByTagName('tbody')[0],
			/*
			 * {"Vehicle":"68","VehicleTransicsId":"95","KmDebut":"569439","KmFin":"570042","DateDebut":"2015-08-03 03:50:00","DateFin":"2015-08-05 07:55:00","Distance":"603"}
			 */
				ajoutLigne = function( lg ) {
					var ligne = tbody.insertRow(-1),
						/**
						 * Ajout une cellule à partir d'un libellé et d'une liste de class
						 */
						ajoutCell = function( lib, classArray ) {
							var cellule = ligne.insertCell(-1);
							
							cellule.textContent = lib || '';
//							( classArray || [] ).forEach( function( item ) { return cellule.classList.add(item); } );
							( classArray || [] ).forEach( (item) => { return cellule.classList.add(item); } );
								
							return cellule;
						},
						/**
						 * Gere les mise à jour saisies dans la colonne CA
						 */
						caChange = function( txtInput, ligne ) {
							var changeCA = {
									numParc : ligne.querySelector('td .numParc').textContent,
									montant : txtInput.value,
									mois : moisRef()
								},
								procReponse = function( reponse ) {
									 txtInput.value = reponse.montant;
									 return txtInput.style.borderColor = 'green'
								},
								uri = './services/parc/updateCA',
								xhrCA = new XMLHttpRequest();
	
							xhrCA.open("POST", uri, true);
							xhrCA.onreadystatechange = function() {
								if (xhrCA.readyState == 4 && xhrCA.status == 200) {
									// Handle response.
									procReponse(JSON.parse(xhrCA.responseText));
								}
							};
							
							txtInput.style.borderColor = 'red';
							
							return xhrCA.send(JSON.stringify(changeCA));						
						},
						ajoutCellInput = function( lib, evtChange ) {
							var cellule = ligne.insertCell(-1),
								input = cellule.appendChild( document.createElement('input') );
								
							input.setAttribute( 'type', 'text' )
							input.value = lib || '';
							
							if( evtChange != undefined ) {
								input.addEventListener('change', function(e) {
									return evtChange( input, ligne ); 
								});
							}
							
							return cellule;
						},
						cellParc = ligne.insertCell(-1),
						spanParc = cellParc.appendChild( document.createElement('span') ),
						cellImmat = ligne.insertCell(-1),
						spanImmat = cellImmat.appendChild( document.createElement('span') ),
						spanTransics = cellImmat.appendChild( document.createElement('span') ),
						conso = lg.conso,
						viewConco = function( detailConso ) {
							return `<span class="idTransics">` + detailConso.DriverTransicsId + '</span><div>' + detailConso.driverName + '<span>' + detailConso.NbJours + '</span></div>';
						},
						totConso = conso.reduce(function(valeurPrecedente, valeurCourante){
							valeurPrecedente.listConduct += viewConco(valeurCourante);
							valeurPrecedente.gasoil += +valeurCourante.TotalConso;
						  return valeurPrecedente;
						}, { listConduct : '', gasoil : 0 });
						
						
					spanParc.textContent = lg.Vehicle;
					spanParc.classList.add('numParc');
					spanImmat.textContent = lg.immat;
					
					spanTransics.textContent = lg.VehicleTransicsId;
					spanTransics.classList.add('idTransics');

					ajoutCell( lg.Category ); // Type
					(ajoutCell( '', [ 'conducteur' ] )).innerHTML = totConso.listConduct; // Chauffeur
					ajoutCellInput( (lg.montant_cam / 100).toFixed(2), caChange ); // CA

					ajoutCell( lg.KmFin - lg.KmDebut, [ 'td-km', 'nombre' ] );
					ajoutCell( ( lg.montant_cam / 100 / (lg.KmFin - lg.KmDebut) ).toFixed(5) ); // Terme Km
					ajoutCell( lg.NbJours, [ 'nombre' ] ); // Jours Travaillés
					ajoutCell( '', [ 'nombre', 'td-euro' ] ); // CA Jour
					ajoutCell( (+lg.MontantAutoroute).toFixed(2), [ 'nombre', 'td-euro' ] ); // Autoroute
					ajoutCellInput( totConso.gasoil.toFixed(1) ); // Gasoil
					ajoutCell( '', [ 'nombre' ] ); // Conso 100km
					ajoutCell( '', [ 'nombre' ] ); // Pneumatiques
					ajoutCell( (lg.CoutOR / 100).toFixed(2), [ 'nombre', 'td-euro' ] ); // Cout Entretien
					ajoutCell( '', [ 'nombre', 'td-euro' ] ); // Total Cout
					
					return ligne;
				};
				
		
			// retire tous les enfants d'un élément
			while (tbody.firstChild) {
			  tbody.removeChild(tbody.firstChild);
			};
			
			(Object.keys(objParc)).forEach( function(item) { return ajoutLigne( objParc[item] ) });
			
			recalcTbody();
			
			btCalcul.disabled = false;
			btnImpCoutsMensuel.disabled = false;
			document.getElementById('ajax-loader').style.display = 'none';
			
			return;
		},
		calcRecap = function (){
			var formData = new FormData();
			
			formData.append( 'mois', moisRef() );

/*			
			fetch( new Request( './php/getStatVehicles.php', { method: "POST", body: formData } ) ).then(function(response) {
			  return response.json().then(function(data){
					listReleveKm( data.result );
				});
			}).catch(function (error) {  
				alert('Request failed', error);  
			});
*/
			document.getElementById('ajax-loader').style.display = 'inline-block';
			btCalcul.disabled = true;

			xhrRecapCout.open("POST", "./php/getStatVehicles.php", true);
			xhrRecapCout.send(formData);
			
			return false;
		},
		sendFileCA = function (file) {
			var uri = "./php/uploadXmlCA.php",
				xhr = new XMLHttpRequest(),
				fd = new FormData();
			
			xhr.open("POST", uri, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					// Handle response.
					formCA.fileSelect.disabled = false;
					calcRecap();
				}
			};
			fd.append('mois', moisRef());
			fd.append('fileCA', file);
			// Initiate a multipart/form-data upload
			xhr.send(fd);
		},
		handleFileCa = function () {
			formCA.fileSelect.disabled = true;
			
			return sendFileCA( fileElement.files[0] );
		},
		afficheRecap = function (event){
			event.stopPropagation();
			event.preventDefault();
			
			return calcRecap();
		},
		calculLigne = function (event){
			
		},
		dateRef = new Date(),
		traiteReponse = function(data) {
			var jsonData = JSON.parse(data);
			
			return listResult( jsonData.vehicules );
		};
	
	xhrRecapCout.onreadystatechange = function (aEvt) {
	  if (xhrRecapCout.readyState == XMLHttpRequest.DONE) {
		 if(xhrRecapCout.status == 200) {
		  traiteReponse(xhrRecapCout.responseText);
		 } else {
		  alert("Erreur pendant le chargement de la page.\n");
	     }
	  }
	};
	
 	dateRef.setMonth( dateRef.getMonth() - 1 );
	monthPickerFactory.createMonthPicker( formRecap.moisRef );
	formRecap.moisRef.value = [ ( '0' + ( dateRef.getMonth() + 1 ) ).slice(-2), dateRef.getFullYear() ].join('/');
		
	formRecap.addEventListener('submit', afficheRecap);
	btCalcul.disabled = false;
	
	// Gere le formulaire CA
	fileElement.addEventListener("change", handleFileCa, false);
	formCA.fileSelect.addEventListener("click", function(e) {
		
		e.preventDefault(); // prevent navigation to "#"
		
		return fileElement.click();
	}, false);

	inputCoef.addEventListener('change', recalcTbody );
	
	/*
	 * Affichage du pdf Récapitulatif des coûts
	 */
	btnImpCoutsMensuel.disabled = true;
	btnImpCoutsMensuel.addEventListener( 'click', function() {
		return domFenetrePdf( pdfCoutsMensuel( tableResult, 'Récapitulatif des coûts ' + libMoisRef().toLowerCase() ), 'Récapitulatif des coûts' );
	});


	return this;
}

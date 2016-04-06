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
 * @date revision 05/04/2016 Ajout manuel de tracteurs
 *
 * Appel  ajax:
 * - ./php/getStatVehicles.php
 * - ./services/parc/updateCA
 * - ./services/parc/updateKM
 * - ./services/parc/updateATR
 * - ./services/parc/updateOil
 *
 * A Faire
 * - presentation de la saisie de nouvelle ligne
 * - rassembler les update dans une seule procedure
 * - Ligne des totaux
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

ctrlRecapCouts = function( formRecap, formCA, inputCoef, tableResult ) {
	'use strict';
	
	var btCalcul = formRecap.calculResult,
		btnAjoutLigne = document.getElementById('btnAjoutLigne'),
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
				kmParcourt = Number(listTd[5].firstChild.value),
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
		chargeModif = function( ) {
			var collecTr = tableResult.querySelectorAll('tbody tr'),
				lenTr = collecTr.length,
				procReponse = function( reponse ) {
					reponse.result.forEach( function(item){
						var numParc = item.mdf_numParc,
							done = false,
							i, listTd, champInput,
							strCell, trAdd, listInput;
						
						for( i = 0 ; i < lenTr && !done; i++ ) {
							if(collecTr[i].querySelector('td .numParc').textContent == numParc) {
								listTd = collecTr[i].querySelectorAll('td'),
								listInput = collecTr[i].querySelectorAll('td input');
								
								if(item.mdf_ca != null) {
									champInput = listInput[0]
									
									champInput.value = item.mdf_ca;
									champInput.style.color = 'blue';
								}
								if(item.mdf_km != null) {
									champInput = listInput[1]
									
									champInput.value = item.mdf_km;
									champInput.style.color = 'blue';
								}
								if(item.mdf_cout_autoroute != null) {
									champInput = listInput[2]
									
									champInput.value = item.mdf_cout_autoroute;
									champInput.style.color = 'blue';
								}
								if(item.mdf_gasoil != null) {
									champInput = listInput[3]
									
									champInput.value = item.mdf_gasoil;
									champInput.style.color = 'blue';
								}

								done = true;
							}
						}
						
						if(!done) {
							strCell = '<td><span class="numParc">' + item.mdf_numParc + '</span></td>'
								+ '<td><span>' + item.mdf_immat + '</span><span class="idTransics"></span></td>'
								+ '<td> </td>'
								+ '<td class="conducteur"><span class="idTransics"></span>' // IdTransics
								+ '<div>' + item.mdf_libConducteur + '<span>' + item.mdf_nbJours + '</span></div>'
								+ '</td>'
								+ '<td><input type="text" value="' + item.mdf_ca + '"></td>'
								+ '<td><input type="text" value="' + item.mdf_km + '"></td>'
								+ '<td></td>'
								+ '<td class="nombre"></td>'
								+ '<td class="nombre td-euro"></td>'
								+ '<td><input type="text" value="' + item.mdf_cout_autoroute + '"></td>'
								+ '<td><input type="text" value="' + item.mdf_gasoil + '"></td>'
								+ '<td class="nombre"></td>'
								+ '<td class="nombre"></td>'
								+ '<td class="nombre td-euro"></td>'
								+ '<td class="nombre td-euro"></td>'; // total
								
							trAdd = tableResult.querySelector('tbody').insertRow();
							trAdd.innerHTML = strCell;
							
							listInput = trAdd.querySelectorAll('input');
							listInput[0].addEventListener('change', function( e ) {
								var txtInput = listInput[0],
									changeCA = {
										numParc : trAdd.querySelector('td .numParc').textContent,
										valeur : txtInput.value,
										mois : moisRef()
									},
									procReponse = function( reponse ) {
										 txtInput.value = reponse.valeur;
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
							});
							listInput[1].addEventListener('change', function( e ) {
								var txtInput = listInput[1],
									changeKM = {
										numParc : trAdd.querySelector('td .numParc').textContent,
										valeur : txtInput.value,
										mois : moisRef()
									},
									procReponse = function( reponse ) {
										 txtInput.value = reponse.valeur;
										 return txtInput.style.borderColor = 'green'
									},
									uri = './services/parc/updateKM',
									xhrKM = new XMLHttpRequest();
		
								xhrKM.open('POST', uri, true);
								xhrKM.onreadystatechange = function() {
									if (xhrKM.readyState == 4 && xhrKM.status == 200) {
										// Handle response.
										procReponse(JSON.parse(xhrKM.responseText));
									}
								};
								
								txtInput.style.borderColor = 'red';
								
								return xhrKM.send(JSON.stringify(changeKM));						
							});
							
							[
							 { champ: listInput[2], uri: './services/parc/updateATR'},
							 { champ: listInput[3], uri: './services/parc/updateOil'}
							].forEach( function(item) {
								var txtInput = item.champ;
								
									txtInput.addEventListener('change', function( e ) {
										var changeValeur = {
											numParc : trAdd.querySelector('td .numParc').textContent,
											valeur : txtInput.value,
											mois : moisRef()
										},
										procReponse = function( reponse ) {
											 txtInput.value = reponse.valeur;
											 return txtInput.style.borderColor = 'green'
										},
									//	uri = './services/parc/updateATR',
										uri = item.uri,
										xhrUpdate = new XMLHttpRequest();
			
									xhrUpdate.open('POST', uri, true);
									xhrUpdate.onreadystatechange = function() {
										if (xhrUpdate.readyState == 4 && xhrUpdate.status == 200) {
											// Handle response.
											procReponse(JSON.parse(xhrUpdate.responseText));
										}
									};
									
									txtInput.style.borderColor = 'red';
									
									return xhrUpdate.send(JSON.stringify(changeValeur));						
								});
							});
						}
						
					});

					return;
				},
				uri = './services/parc/listModif?mois=' + moisRef(),
				xhrChg = new XMLHttpRequest();

			xhrChg.open('GET', uri, true);
			xhrChg.onreadystatechange = function() {
				if (xhrChg.readyState == 4 && xhrChg.status == 200) {
					// Handle response.
					procReponse(JSON.parse(xhrChg.responseText));
				}
			};
			
			return xhrChg.send();
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
									valeur : txtInput.value,
									mois : moisRef()
								},
								procReponse = function( reponse ) {
									 txtInput.value = reponse.valeur;
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
						/**
						 * Gere les mise à jour saisies dans la colonne KM
						 */
						kmChange = function( txtInput, ligne ) {
							var changeKM = {
									numParc : ligne.querySelector('td .numParc').textContent,
									valeur : txtInput.value,
									mois : moisRef()
								},
								procReponse = function( reponse ) {
									 txtInput.value = reponse.valeur;
									 return txtInput.style.borderColor = 'green'
								},
								uri = './services/parc/updateKM',
								xhrKM = new XMLHttpRequest();
	
							xhrKM.open('POST', uri, true);
							xhrKM.onreadystatechange = function() {
								if (xhrKM.readyState == 4 && xhrKM.status == 200) {
									// Handle response.
									procReponse(JSON.parse(xhrKM.responseText));
								}
							};
							
							txtInput.style.borderColor = 'red';
							
							return xhrKM.send(JSON.stringify(changeKM));						
						},
						ATRChange = function( txtInput, ligne ) {
							var changeVal = {
									numParc : ligne.querySelector('td .numParc').textContent,
									valeur : txtInput.value,
									mois : moisRef()
								},
								procReponse = function( reponse ) {
									 txtInput.value = reponse.valeur;
									 return txtInput.style.borderColor = 'green'
								},
								uri = './services/parc/updateATR',
								xhrChg = new XMLHttpRequest();
	
							xhrChg.open('POST', uri, true);
							xhrChg.onreadystatechange = function() {
								if (xhrChg.readyState == 4 && xhrChg.status == 200) {
									// Handle response.
									procReponse(JSON.parse(xhrChg.responseText));
								}
							};
							
							txtInput.style.borderColor = 'red';
							
							return xhrChg.send(JSON.stringify(changeVal));						
						},
						oilChange = function( txtInput, ligne ) {
							var changeVal = {
									numParc : ligne.querySelector('td .numParc').textContent,
									valeur : txtInput.value,
									mois : moisRef()
								},
								procReponse = function( reponse ) {
									 txtInput.value = reponse.valeur;
									 return txtInput.style.borderColor = 'green'
								},
								uri = './services/parc/updateOil',
								xhrChg = new XMLHttpRequest();
	
							xhrChg.open('POST', uri, true);
							xhrChg.onreadystatechange = function() {
								if (xhrChg.readyState == 4 && xhrChg.status == 200) {
									// Handle response.
									procReponse(JSON.parse(xhrChg.responseText));
								}
							};
							
							txtInput.style.borderColor = 'red';
							
							return xhrChg.send(JSON.stringify(changeVal));						
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
							return '<span class="idTransics">' + detailConso.DriverTransicsId + '</span><div>' + detailConso.driverName + '<span>' + detailConso.NbJours + '</span></div>';
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
					
					ajoutCellInput( lg.KmFin - lg.KmDebut, kmChange ); // km

					ajoutCell( ( lg.montant_cam / 100 / (lg.KmFin - lg.KmDebut) ).toFixed(5) ); // Terme Km
					ajoutCell( lg.NbJours, [ 'nombre' ] ); // Jours Travaillés
					ajoutCell( '', [ 'nombre', 'td-euro' ] ); // CA Jour
					
					ajoutCellInput( (+lg.MontantAutoroute).toFixed(2), ATRChange ); // Autoroute
//					ajoutCell( (+lg.MontantAutoroute).toFixed(2), [ 'nombre', 'td-euro' ] ); // Autoroute
					
					ajoutCellInput( (totConso.gasoil || 0).toFixed(1), oilChange ); // Gasoil
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
			
			objParc.sort( ( a, b ) => { return +a.Vehicle - +b.Vehicle; } );
//			objParc.sort( ( a, b ) => +a.Vehicle - +b.Vehicle; );
			objParc.forEach(ajoutLigne);
			
			chargeModif();
			recalcTbody();
			
			btCalcul.disabled = false;
			btnImpCoutsMensuel.disabled = false;
			document.getElementById('ajax-loader').style.display = 'none';
			tableResult.querySelector('tfoot').firstElementChild.style.display = '';	
			
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

	// recalcul la page lorsque l'on modifie le coeficient
	inputCoef.addEventListener('change', recalcTbody );
	
	/*
	 * Affichage du pdf Récapitulatif des coûts
	 */
	btnImpCoutsMensuel.disabled = true;
	btnImpCoutsMensuel.addEventListener( 'click', function() {
		return domFenetrePdf( pdfCoutsMensuel( tableResult, 'Récapitulatif des coûts ' + libMoisRef().toLowerCase() ), 'Récapitulatif des coûts' );
	});
	
	document.getElementById('btn-nelleLigne').addEventListener( 'click', function() {
		return tableResult.querySelector('tfoot').lastElementChild.style.display = '';	
	});

	document.getElementById('btn-validLigne').addEventListener( 'click', function(e) {
		var dummy = e.preventDefault(),
			d2 = e.stopPropagation(),
			formInsert = document.forms['modifRecap'],
			paramInsert = {
				numParc : formInsert.numParc.value,
				immat : formInsert.immat.value,
				conduct : formInsert.conduct.value,
				jourTravail : formInsert.jourTravail.value,
				mois : moisRef()
			},
			procReponse = function( reponse ) {
				 return btCalcul.click();
			},
			uri = './services/parc/ajoutLigne',
			xhrInsert = new XMLHttpRequest();

		
		xhrInsert.open('POST', uri, true);
		xhrInsert.onreadystatechange = function() {
			if (xhrInsert.readyState == 4 && xhrInsert.status == 200) {
				// Handle response.
				procReponse(JSON.parse(xhrInsert.responseText));
			}
		};

		return xhrInsert.send(JSON.stringify(paramInsert));						
	});

	return this;
}

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
 *
 * Appel  ajax:
 * - ../php/getStatVehicles.php
 *
 * A Faire
 * Mise en forme des dates
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

ctrlRecapCouts = function( formRecap, formCA, tableResult ) {
	var btCalcul = formRecap.calculResult,
		moisRef = function() {
			var arrMois = formRecap.moisRef.value.split('/');
			
			return arrMois[1] + ( '0' + arrMois[0] ).slice(-2);
		},
		fileElement = formCA.fileElement,
		xhrRecapCout = new XMLHttpRequest(),
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
							if(classArray) {
								classArray.forEach( function( item ) { return cellule.classList.add(item); } );
							}
								
							return cellule;
						},
						cellParc = ligne.insertCell(-1),
						spanParc = cellParc.appendChild( document.createElement('span') ),
						spanImmat = cellParc.appendChild( document.createElement('span') ),
						spanTransics = cellParc.appendChild( document.createElement('span') ),
						conso = lg.conso,
						totConso = conso.reduce(function(valeurPrecedente, valeurCourante){
							valeurPrecedente.listConduct += ('<p><span>' + valeurCourante.DriverTransicsId + '<span>' + valeurCourante.driverName + '</p>');
							valeurPrecedente.gasoil += +valeurCourante.TotalConso;
						  return valeurPrecedente;
						}, { listConduct : '', gasoil : 0 });
						
					spanParc.textContent = lg.Vehicle;
					spanParc.classList.add('numParc');
					spanImmat.textContent = lg.immat;
					
					spanTransics.textContent = lg.VehicleTransicsId;
					spanTransics.classList.add('idTransics');

					ajoutCell( lg.Category ); // Type
					(ajoutCell( )).innerHTML = totConso.listConduct; // Chauffeur
					ajoutCell( Math.round(lg.montant_cam) ); // CA
					ajoutCell( lg.KmFin - lg.KmDebut, [ 'td-km', 'nombre' ] );
					ajoutCell( ); // Terme Km
					ajoutCell( lg.NbJours, [ 'nombre' ] ); // Jours Travaillés
					ajoutCell( ); // CA Jour
					ajoutCell( ); // Autoroute
					ajoutCell( totConso.gasoil ); // Gasoil
					ajoutCell( ); // Pneumatiques
					ajoutCell( (lg.CoutOR / 100).toFixed(2), [ 'nombre', 'td-euro' ] ); // Cout Entretien
					ajoutCell(  ); // Total Cout
					
					return ligne;
				};
				
			btCalcul.disabled = true;
		
			// retire tous les enfants d'un élément
			while (tbody.firstChild) {
			  tbody.removeChild(tbody.firstChild);
			};
			
			(Object.keys(objParc)).forEach( function(item) { return ajoutLigne( objParc[item] ) });
			
			btCalcul.disabled = false;
			
			return;
		},
		chargeCa = function (event){
			alert('charge ca')
		},
		sendFileCA = function (file) {
			var uri = "./php/uploadXmlCA.php",
				xhr = new XMLHttpRequest(),
				fd = new FormData();
			
			xhr.open("POST", uri, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					// Handle response.
					alert(xhr.responseText); // handle response.
					formCA.fileSelect.disabled = false;
				}
			};
			fd.append('mois', moisRef());
			fd.append('myFile', file);
			// Initiate a multipart/form-data upload
			xhr.send(fd);
		},
		handleFileCa = function () {
			
			formCA.fileSelect.disabled = true;
			return sendFileCA( fileElement.files[0] );
		},
		afficheRecap = function (event){

			var /*f = event.target,
				arrMois = f.moisRef.value.split('/'),*/
				formData = new FormData();
				
			event.stopPropagation();
			event.preventDefault();
			
			formData.append( 'mois', moisRef() );
//			formData.append( 'mois', arrMois[1] + ( '0' + arrMois[0] ).slice(-2) );
//			formData.append( 'typeVehicule',  ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque' );

/*			
			fetch( new Request( './php/getStatVehicles.php', { method: "POST", body: formData } ) ).then(function(response) {
			  return response.json().then(function(data){
					listReleveKm( data.result );
				});
			}).catch(function (error) {  
				alert('Request failed', error);  
			});
*/
			xhrRecapCout.open("POST", "./php/getStatVehicles.php", true);
			xhrRecapCout.send(formData);
			
			return false;
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


	return this;
}

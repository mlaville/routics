/**
 * statOr.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       13/09/2015
 * @version    0.5
 * @revision   $0$
 *
 * Gestion des ordres de réparation
 * 
 * @date revision   
 *
 * Appel  ajax:
 * - ../php/getStatVehicles.php
 * - ./php/pdfStatVehicle.php -- obsolete
 *
 *
 * A Faire
 * - gerer les requetes ajax sans JQuery
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

function listStatVehicule( unTab, objParam ) {

	var tableStat = document.getElementById('table-stat'),
		tbody = tableStat.getElementsByTagName('tbody')[0],
		lgTot = unTab[unTab.length - 1],// Référence la ligne de totaux 
		expendSousTotal = function(tr) {
			return function() {
				var previousTr = tr.previousSibling;
				
				while( previousTr && !previousTr.classList.contains("sousTotal") ) {
					previousTr.classList.toggle("masque");
					previousTr = previousTr.previousSibling;
				}
				return false;
			};
		},
		
		ajoutLigne = function( lg ) {
			var ligne = tbody.insertRow(-1),
				expendCheck = function() {
					var label = document.createElement('label'),
						chk = label.appendChild( document.createElement('input') );
					
					chk.setAttribute('type', 'checkbox');
					chk.addEventListener('change', expendSousTotal(ligne));
					
					label.appendChild(document.createElement('div'));
					
					return label;
				},
				ajoutCell = function( lib, classArray ) {
					var cellule = ligne.insertCell(-1);
					
					cellule.textContent = lib || '';
					if(classArray) {
						classArray.forEach( function( item ) { return cellule.classList.add(item); } );
					}
						
					return cellule;
				};
				
			if( lg.VehicleID != null ) {
				ligne.classList.add("masque");
				ajoutCell();
				ajoutCell(lg.VehicleID);
				ajoutCell(lg.LicensePlate);
				ajoutCell( objParam.rupture == 'marque' ? lg.Filter : lg.ChassisNumber);
			} else {
				/* Ligne de Rupture */
				ligne.classList.add("sousTotal");
				if( lg.Rupture != null ) {
					ligne.appendChild( document.createElement('td') )
						/* Creation du lien pour gèrer l'expansion */
						.appendChild( expendCheck() );
					
					
					ajoutCell(lg.NbVehicule + ' ' + lg.Rupture);
					ajoutCell(Math.round( 1000 * lg.NbVehicule/lgTot.NbVehicule ) / 10, [ "nombre", "pourcent" ]);
				} else {
					/* Derniere ligne */
					var tdTot = ligne.appendChild( document.createElement('td') );

					ajoutCell(lg.NbVehicule + ' Véhicules');
					ajoutCell();
				}
				ajoutCell('');
			}
			
			ajoutCell(lg.Kms, [ 'td-km', 'nombre' ]);

			if( lg.VehicleID == null ) {
				ajoutCell( Math.round( 1000 * lg.Kms/lgTot.Kms ) / 10, [ 'pourcent', 'nombre' ] );
			} else {
				ajoutCell( '' );
			}
			ajoutCell( lg.NbOr, [ 'nombre' ] );
			ajoutCell( lg.TotCout, [ 'nombre', 'td-euro' ] );
			
			if( lg.VehicleID == null ) {
				ajoutCell( Math.round( 1000 * lg.TotCout/lgTot.TotCout ) / 10, [ 'nombre', 'pourcent' ] );
			} else {
				ligne.lastChild.setAttribute("colspan", "2");
			}
			
			ajoutCell( lg.CoutKm, [ 'nombre', 'td-euro-km' ] );
			
			return ligne;
		};
	
	tableStat.getElementsByTagName('caption')[0].textContent = ' du ' + objParam.dateInf + ' au ' + objParam.dateSup;
	// retire tous les enfants d'un élément
	while (tbody.firstChild) {
	  tbody.removeChild(tbody.firstChild);
	}
	unTab.forEach(ajoutLigne);
	
	return;
}

function afficheStat(event){

	var f = event.target,
		param = {
			dateInf: f["dateInf"].value, 
			dateSup: f["dateSup"].value,
			typeVehicule: ( AppOr.typeVehicule == 0 ) ? 'tracteur' : 'remorque',
			rupture: f["rupture"][0].checked ? 'marque' : 'transport'
		};
	
	event.preventDefault();
		
	f["calculStat"].disabled = true;
	
	$.post("./php/getStatVehicles.php", param,
		function(data){
			listStatVehicule( data.result, param );
			f["calculStat"].disabled = false;
	}, "json");

	return false;
}


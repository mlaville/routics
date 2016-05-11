/**
 * tt.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013-2016
 * @date       26/06/2013
 * @version    1.0
 * @revision   $0$
 *
 * @date revision   12/10/2013 Chargement asynchrone des temps OdB
 * @date revision   10/01/2014 administration des arrêts (temps, couleur)
 * @date revision   21/04/2014  détermine les jous fériés paques
 * @date revision   21/04/2014  Edition du planning
 * @date revision   25/05/2014  Interprétation du window.location.search
 * @date revision   01/07/2014  Affichage des Vacances et des jous fériés  ascenssion, pentecôte
 * @date revision   05/05/2015  Prise en compte des données custom
 * @date revision   27/07/2015  Passage du parametre zone pour la requete des jours fériés
 * @date revision   15/12/2015  Affichage des heures de nuit
 * @date revision   18/12/2015  Correction heure nuit -> jour
 * @date revision   02/01/2016  Reecriture estFerie
 * @date revision   05/03/2016  Libellé du jour dans les entêtes de colonne du planning
 * @date revision   20/03/2016  planning des heures de nuit
 * @date revision   29/03/2016  debug sec2time (quand la valeur passée en argument est 0)
 * @date revision   11/05/2016  debug la gestion du drag and drop 
 *
 * Affichage du planning client
 * 
 * Ajax : 
 * - getDrivers.php
 * - syntheseActiDriver.php
 * - crudArretTravail.php
 * - crudDriver.php
 * -./php/joursVacancesMois.php
 * -./services/stat/
 *
 * A Faire
 * - gerer le rechargement quand il y a un erreur de timeout au chargement des temps de travail
 * - afficher les jours fériés en édition
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

'use strict';
var	modeleTT = null;

var	tabJourOuvres = [],
	nbJourRestant = 0;

/* 
 * Remplie le Header de la table planning
 */
function fillRowTHeader( dateCal, tr, dataVacances ) {

	var today = new Date(),
		dateRef = new Date(+dateCal),
		monthRef = dateRef.getMonth(),
		strMonth = [ dateRef.getFullYear(), monthRef + 1 ].join( '-' ),
		libMois = Date.monthNames()[monthRef],
		libJours = Date.dayNames(),
		th1, th,
		divLib, divJour,
		nbJourOuvre;
	
	tabJourOuvres = [];
	
	tr.innerHTML ='<th><div class="month">' + libMois + '</div><div class="year">' + dateRef.getFullYear() + '</div></th>'
		+ '<th>cumul<br>Tachy</th><th>Maxi</th><th>Reste</th><th>cumul<br>OdB</th><th>Réserve</th>';
	tr.parentNode.parentNode.setAttribute( 'data-mois', strMonth );
	th1 = tr.getElementsByTagName('th')[1]; // 2ème élèment, pour les insertBefore

	/* 
	 * Parcourt les jours du mois 
	 * Cree une cellule d'entete pour chaque jour
	 * Enumere les jours ouvrés
	 */
	for( dateRef.setDate(1), dateRef.setHours(23), today.setHours(0);
		dateRef.getMonth() == monthRef;
		dateRef.setDate( dateRef.getDate() + 1 ) ) {
		var jourMois = dateRef.getDate();
		
		th = tr.insertBefore( document.createElement('th'), th1 ),
			divLib = th.appendChild( document.createElement('div') ),
			divJour = th.appendChild( document.createElement('div') ),
		
		th.classList.add("day");
		th.dataset.jour = dateRef.getDay();
		if( dataVacances.indexOf(jourMois) >= 0 ) {
			th.classList.add("vacances");
		};
		divJour.textContent = jourMois;
		divLib.textContent = libJours[dateRef.getDay()];

		if( dateRef.estFerie() ) {
			th.classList.add("ferie");
//			tabJourOuvres.push(0);
			tabJourOuvres.push(null);
		} else {
			tabJourOuvres.push( dateRef.getDay() * ( ( dateRef >= today ) ? 1 : -1 ) );
		}
	}
	
	nbJourOuvre = nbJourRestant = 0;
	tabJourOuvres.forEach( function(item){
		if( Math.abs(item) > 0 && Math.abs(item) < 6) {
			nbJourOuvre++;
		}
		if( item > 0 && Math.abs(item) < 6) {
			nbJourRestant++;
		}
	});
	
	[ nbJourOuvre - nbJourRestant, nbJourOuvre, nbJourRestant ].forEach( function(item){
		th = th.nextSibling;
		th.appendChild( document.createElement('small') ).textContent = item + " jours";
	});
	
	return tabJourOuvres;
}

// Formate une durée en seconde vers heure + minute
function sec2time( valSecond ) {
	var val = Number.isNaN( valSecond ) ? 0 : Number(valSecond),
		s = val % 60,
		m = (( val - s ) / 60) % 60,
		h = ( val - ( 60 * m ) - s ) / 3600;
	
	return '' + h + 'h' + ('0' + m).slice(-2);
}


/* Réponse à un click sur cellule arret de travail */
function afficheAT( event ) {
	var td = event.target;

	if( confirm( 'supprimer l\'arrêt de travail ?') ) {
		$.post("./php/crudArretTravail.php",
			{
				cmd: "delete",
				driverIdTransics: td.parentNode.firstChild.lastChild.textContent, // Référence la cellule Indentifiant le conducteur
				dateArret:td.parentNode.parentNode.parentNode.dataset.mois + '-' + td.dataset.numJour
			},
			function(data){
				if(data.success) {
					var jour = td.dataset.numJour,
						ds = td.parentNode.dataset;
					
//					td.removeEventListener( 'click', afficheAT );
					td.textContent = '';
					td.classList.remove('arret-travail');
					td.style.backgroundColor = '#eee';
					if( tabJourOuvres[ jour-1] > 0 ) {
						ds.cumul_at = parseInt( ds.cumul_at ) - 1;
					}
					if( data.duree > 0 ) {
						ds.cumul_tt_mois = parseInt( ds.cumul_tt_mois ) - 60 * data.duree;
					}
					gereDepassement( td.parentNode );
					
//					cibleDrop( td );

				} else {
					alert(data.error.reason);
				}
			},
			"json"
		);
	}
	
	return;
}

function clickDate( event ){
	var td = event.target;
	
	if(td.classList.contains('arret-travail')) {
		return afficheAT( event );
	} else {
	}
	
	return;
}

var defautTTJour = 10;

function gereDepassement( tr ) {
	var ds = tr.dataset,
		depassement = ( parseInt(ds.cumul_tt_mois) + defautTTJour * 3600 * ( nbJourRestant - parseInt(ds.cumul_at) ) ) - parseInt(ds.quota_secondes),
		nodesDay = tr.querySelectorAll('td.day'),
		nbJour = nodesDay.length,
		tdAlert = nodesDay.item( nbJour - 1 ),
		tdCumul = tdAlert.nextSibling,
		tdReste = tdCumul.nextSibling.nextSibling,
		reste =  ( ( +ds.quota_secondes > +ds.cumul_tt_mois ) ? '' : '-' ) + sec2time( Math.abs( ds.quota_secondes - ds.cumul_tt_mois ) ),
		resteStyle = tdReste.style,
		nbHeureReste = parseInt( reste );
		
	tdCumul.firstChild.textContent = sec2time( parseInt(ds.cumul_tt_mois) ); // Premiere cellule après la liste des jours
	tdReste.textContent = reste;
	resteStyle.backgroundColor = '';
	resteStyle.color = '';
	resteStyle.fontWeight = 'bold';
	if( nbHeureReste < 80 ) {
		if( nbHeureReste < 40 ) {
			if( nbHeureReste < 0 ) {
				resteStyle.backgroundColor = 'black';
				resteStyle.color = 'white';
			} else {
				resteStyle.backgroundColor = 'red';
			}
		} else {
				resteStyle.backgroundColor = 'orange';
		}
	}

	for( i = 0 ; i < nbJour ; i++ ) {
		nodesDay.item( i ).classList.remove( 'rouge' );
	}

	if( depassement > 0 ) {
		while( tdAlert != null && depassement >= defautTTJour * 3600  ) {
			var cl = tdAlert.classList;
			while( tdAlert != null && ( tdAlert.classList.contains("ferie") || tdAlert.classList.contains("samedi") || tdAlert.classList.contains("arret-travail") ) ) {
				tdAlert = tdAlert.previousSibling;
			}
			// A faire : controler que l'on est encore sur une cell jour (.day)
			tdAlert.classList.add( "rouge" );
			depassement -= ( defautTTJour * 3600 );
			tdAlert = tdAlert.previousSibling;
		}
	}

	return depassement;
}

/**
 * Affiche une ligne du calendrier
 * dataConduct : Object
 * tabOuvres : Array
 */
function ligneTT( dataConduct, tabOuvres ) {

	var trConducteur = document.createElement('tr'),
		nbJour = tabOuvres.length,
		typeTTs = ['RD', 'AA', 'AO', 'arretTravail'],
		cumulTachy = { RD:0, AR:0, AA:0, AO:0, arretTravail:0 },
		ttMois = dataConduct.tt.ttMois,
		atMois = dataConduct.arretsTravail,
		actiMois = dataConduct.activite,
		typeActi = ['RD', 'A', 'O'],
		cumulActi = { RD:0, A:0, O:0 },
		cumulJourAT = 0,
		td = trConducteur.appendChild( document.createElement('td') ),
		cumul_ttMois = 0, cumul_actiMois = 0, ul, span_cumul, input,
		quota_secondes = dataConduct.tempsMaxi * 3600, // Maxi tt par conducteur en seconde -> heure
		
		bodyHrNuit = document.getElementById('table-hrNuit').querySelector('tbody'),
		ajoutLigneHrNuit = function(dataConduct) {
			var ligneHrNuit = function(data){
				var i, row = document.createElement('tr'),
					cell = row.insertCell();
					
				cell.dataset.idtransics = data.PersonTransicsID;
				cell.textContent = data.FormattedName.toLowerCase();
				
				for(i = 1 ; i < 15 ; i++) {
					row.insertCell();
				}
				return row;
			};
			
			return bodyHrNuit.appendChild(ligneHrNuit(dataConduct));
		};
	
	ajoutLigneHrNuit(dataConduct);
	// Colonne Conducteur 
	td.appendChild( document.createElement('div') ).textContent = dataConduct.FormattedName.toLowerCase();
	td.appendChild( document.createElement('span') ).textContent = dataConduct.PersonExternalCode;
	td.appendChild( document.createElement('span') ).textContent = dataConduct.PersonTransicsID;
	
	// Parcourt les jours du mois
	for( var numJour = 1 ; numJour <= nbJour ; numJour++ ) {
		var ouvre = tabOuvres[ numJour-1];
		
		// Cree la cellule du jour
		td = trConducteur.appendChild( document.createElement('td') );
		td.classList.add("day");
		if( !ouvre ) {
			td.classList.add("ferie");
		}
		if( ouvre == 0 ) {
			td.classList.add("dimanche");
			td.dataset.jour = 0;
		}
		if( Math.abs( ouvre ) == 6 ) {
			td.classList.add("samedi");
		}
		td.dataset.numJour = numJour;
		
		// Calcul des cumuls Tachy
		if( ttMois != null ) {
			if(ttMois[numJour] != undefined ) {
				var tachyJour = 0,
					ul = td.appendChild( document.createElement('ul') );
				
				for( var t = 0, lgth = typeTTs.length ; t < lgth ; t++ ) {
					var valTT = ttMois[numJour][ typeTTs[t] ];
					
					if( valTT > 0 ) {
						tachyJour += valTT;
						cumulTachy[typeTTs[t]] += valTT;
						ul.appendChild( document.createElement('li') ).textContent = typeTTs[t] + ':' + sec2time( valTT );
					}
				}
				if( tachyJour > 0 ) {
					td.insertBefore( document.createElement('span'), ul ).textContent = sec2time( tachyJour );
				} else {
					td.removeChild( ul );
				}
			}
		}

		// Calcul des Arrets Travail
		if( atMois != null ) {
			if(atMois[numJour] != undefined ) {
				var duree = atMois[numJour].duree; // Duree equivallence en mn

				td.classList.add('arret-travail');
				td.style.backgroundColor = atMois[numJour].couleur;
				td.dataset.at = atMois[numJour].code || '';

				if( ouvre > 0 && ouvre < 6 ) { // Le samedi est ici traité comme un jour férié
					cumulJourAT++;
				}
				if( duree > 0 ) {
					cumulTachy['arretTravail'] += duree * 60;
					td.textContent = Math.round( duree / 60 );
				}
			}
		}
/*		
		// Calcul des cumuls OdB
		if( actiMois != null ) {
			if(actiMois[numJour] != undefined ) {
				var actiJour = 0,
					span_actiJour = td.appendChild( document.createElement('span') ),
					ul = td.appendChild( document.createElement('ul') );
			
				for( var t = 0, lgth = typeActi.length ; t < lgth ; t++ ) {
					var valActi = actiMois[numJour][ typeActi[t] ];
					
					if( valActi > 0 ) {
						actiJour += valActi;
						cumulActi[typeActi[t]] += valActi;
						ul.appendChild( document.createElement('li') ).textContent = typeActi[t] + ':' + sec2time( valActi );
					}
				}
				span_actiJour.textContent = sec2time( actiJour );
			}
		}
*/		
		td.addEventListener( 'click', clickDate );
	}

	/* Affichage du cumul Tachy */
	td = trConducteur.appendChild( document.createElement('td') );
	td.classList.add( 'cumul-tachy' );
	span_cumul = td.appendChild( document.createElement('span') );
	ul = td.appendChild( document.createElement('ul') );
	
	for( var t = 0, lgth = typeTTs.length ; t < lgth ; t++ ) {
		ul.appendChild( document.createElement('li') ).textContent = typeTTs[t] + ':' + sec2time( cumulTachy[typeTTs[t]] );
		cumul_ttMois += cumulTachy[typeTTs[t]];
	}
	span_cumul.textContent = sec2time( cumul_ttMois );
	
	// Extrapole le depassement du quota mensuel
//	depassement = ( quota_secondes - cumul_ttMois ) - Math.round( quota_secondes / nbJourOuvre * nbJourRestant );

	// Stock les valeurs nécessaires aux interractions (drop des élèments arret-travail)
	trConducteur.dataset.transics_id = dataConduct.PersonTransicsID;
	trConducteur.dataset.rupture = dataConduct.ContactInfo.Address.City;
	
	trConducteur.setAttribute( 'data-cumul_tt_mois', cumul_ttMois );
	trConducteur.setAttribute( 'data-cumul_at', cumulJourAT );
	trConducteur.setAttribute( 'data-quota_secondes', quota_secondes );

	// Gere la saisie des quotas mensuels
	td = trConducteur.appendChild( document.createElement('td') );

	input = td.appendChild( document.createElement('input') );
	input.setAttribute( 'type', 'hidden');
	input.value = dataConduct.PersonTransicsID;
	
	input = td.appendChild( document.createElement('input') );
	input.setAttribute( 'type', 'text' );
	input.value = dataConduct.tempsMaxi;
	input.addEventListener( 'click', function(e) {
		var input = e.currentTarget,
			len = input.value.length;
	
		input.focus();
        return input.setSelectionRange(0, len);         
	});
	
	input.addEventListener( 'change', function(e) {
		var input = e.target,
			val = input.value,
			id = input.previousSibling.value;
			
			$.post("./php/crudDriver.php", { cmd:'updateTT', transicsId:id, quota:val},
				function(data){
					if(data.success) {
						var tr = input.parentNode.parentNode;
						
						tr.setAttribute( 'data-quota_secondes', input.value * 3600 );
						gereDepassement( tr );
					}
			}, "json");
	
	});
	
	// Affichage du reste
	td = trConducteur.insertCell();
	/* Affichage du cumul Activité */
	td = trConducteur.appendChild( document.createElement('td') );
	td.classList.add( 'cumul-odb' );

	gereDepassement( trConducteur );
	
	// Gere la saisie de la réserve
	td = trConducteur.appendChild( document.createElement('td') );
	td.textContent = dataConduct.reserve.toFixed();
	/*
	input = td.appendChild( document.createElement('input') );
	input.setAttribute( 'type', 'hidden');
	input.value = dataConduct.PersonTransicsID;
	
	input = td.appendChild( document.createElement('input') );
	input.setAttribute( 'type', 'text' );
	input.value = dataConduct.reserve.toFixed(1);
	input.addEventListener( 'click', pxUtil.selectOnClick );
	input.addEventListener( 'change', function(e) {
		var input = e.target,
			val = input.value,
			id = input.previousSibling.value;
			
		$.post("./php/crudDriver.php", { cmd:'updateReserve', transicsId:id, reserve:val}, function(data){ }, "json");
	});
	*/
	return trConducteur;
}

// Gere le drop d'un Arret de Travail sur une case du calendrier
function cibleDrop( item ) {
	var handleDragOver = function(e) {
		  // this / e.target is the current hover target.
		  this.classList.add('over-drop');
/*		  
		  if( this.hasChildNodes() ) {
			  this.style.backgroundColor = 'red';
			  e.dataTransfer.dropEffect = 'none';
		  } else {
			  this.style.backgroundColor = 'blue';
		  }*/
			  e.dataTransfer.dropEffect = item.hasChildNodes() ? 'none' : 'move';
			  
		  
		},
		handleDragLeave = function(e) {
			  e.dataTransfer.dropEffect = 'move';
		  this.classList.remove('over-drop');  // this / e.target is previous target element.
		};

	item.addEventListener('dragover', handleDragOver, false);
	item.addEventListener('dragleave', handleDragLeave, false);
	item.addEventListener('dragover', cancel);
	item.addEventListener('drop', function (e) {
		
		e.preventDefault(); // stops the browser from redirecting off to the text.

		$.post("./php/crudArretTravail.php",
			{
				cmd: "create",
				driverIdTransics: this.parentNode.querySelector('td').querySelectorAll('span')[1].textContent,
				dateArret:this.parentNode.parentNode.parentNode.dataset.mois + '-' + this.dataset.numJour,
				typeArret :e.dataTransfer.getData('Text')
			},
			function(data){
				if(data.success) {
					var c = e.target,
						jour = c.dataset.numJour,
						ds = c.parentNode.dataset;
					
					c.classList.add('arret-travail');
					c.style.backgroundColor = data.couleur;
					if( tabJourOuvres[ jour-1] > 0 ) {
						ds.cumul_at = parseInt( ds.cumul_at ) + 1;
					}
					if( data.duree > 0 ) {
						c.textContent = Math.round( data.duree / 60 );
						ds.cumul_tt_mois = parseInt( ds.cumul_tt_mois ) + 60 * data.duree;
					}
					gereDepassement( c.parentNode );
				} else {
					alert(data.error.reason);
				}
			}, "json"
		);

		return false;
	});
	
	return;
}

function fillBody( tabTT, tabOuvrees ) {
	var tbody = document.querySelector('#table-calendrier tbody'),
		nbCol = document.querySelectorAll('#table-calendrier thead tr th').length - 5,
		drops, cellATs;

	tabTT.sort( function (a, b) {
		var sortCity = a.ContactInfo.Address.City.localeCompare(b.ContactInfo.Address.City);
		
		return sortCity == 0 ? a.FormattedName.localeCompare(b.FormattedName) : sortCity;
	});
	
	for( var row = 0 ; row < tabTT.length ; row++ ) {
		if( !tabTT[row].Inactive && tabTT[row].tempsMaxi > 0 ) {
			tbody.appendChild( ligneTT( tabTT[row], tabOuvrees ) );
		}
	}
	
	// Gere le drop d'un Arret de Travail sur une case du calendrier
	drops = tbody.querySelectorAll('td.day');
	for( var i = 0, taille = drops.length ; i < taille ; ++i ) {
		cibleDrop( drops[i] );
	}
	
	// Gere le drop d'un Arret de Travail sur une case du calendrier
	cellATs = tbody.querySelectorAll('td.arret-travail');
	for (var i = 0, taille = cellATs.length ; i < taille ; ++i) {
//		cellATs[i].addEventListener( 'click', afficheAT );
	}

	return;
}

function placeActivite( tabActi, trConduct ) {
	var tabJour = trConduct.querySelectorAll('.day'),
		typeActi = ['RD', 'A', 'O'],
		cumulActi = { RD:0, A:0, O:0 },
		tdCumul = trConduct.querySelector('.cumul-odb'),
		cumul_actiMois = 0,
		span_cumul = tdCumul.appendChild( document.createElement('span') ),
		ulCumul = tdCumul.appendChild( document.createElement('ul') ),
		dtJour = new Date(),
		acti;
	
	for (acti in tabActi) {
		var tj = acti.split('-'),
			cell = tabJour[ +tj[2] - 1 ],
			dateCell = new Date(),
			data = tabActi[acti],
			actiJour = 0,
			span_actiJour = document.createElement('span'),
			ul = document.createElement('ul');
		
		dateCell.setFullYear(tj[0], tj[1]-1, tj[2]);
		
		if(dateCell < dtJour) {
			for( var t = 0, lgth = typeActi.length ; t < lgth ; t++ ) {
				var valActi = data[ typeActi[t] ];
				
				if( valActi > 0 ) {
					actiJour += valActi;
					cumulActi[typeActi[t]] += valActi;
					ul.appendChild( document.createElement('li') ).textContent = typeActi[t] + ':' + sec2time( valActi );
				}
			}
			if( actiJour > 0 ) {
				span_actiJour.textContent = sec2time( actiJour );
				cell.appendChild( span_actiJour );
				cell.appendChild( ul );
			}
		}
	}

	for( var t = 0, lgth = typeActi.length ; t < lgth ; t++ ) {
		ulCumul.appendChild( document.createElement('li') ).textContent = typeActi[t] + ':' + sec2time( cumulActi[typeActi[t]] );
		cumul_actiMois += cumulActi[typeActi[t]];
	}
	span_cumul.textContent = sec2time( cumul_actiMois );

	return cumulActi;
}

function erreurChargeActivite( errMsg, trConduct ) {
	var tdCumul = trConduct.querySelector('.cumul-odb'),
		btAffiche = tdCumul.appendChild( document.createElement( 'button' ) ),
		spanAffiche = tdCumul.appendChild( document.createElement( 'span' ) );
		
	spanAffiche.textContent = errMsg;
	btAffiche.addEventListener('click', function(e) {
		alert(errMsg);
	});
	
	return tdCumul;
}

function chargeOdb( strMois, trConduct, synchronise ) {
	var idTransics = trConduct.dataset.transics_id,
		tabDate = strMois.split('-'),
		dateRef = new Date( +tabDate[0], +tabDate[1], 0),
		jqxhr = $.post("./php/syntheseActiDriver.php", { // construction du parametre
			// A Faire : construction propre de l'intervalle de date
			dateInf: strMois + '-01',
			dateSup: strMois + '-' + dateRef.getDate(),
			idDriver: trConduct.dataset.transics_id
		}, 
		function(data){
			if(data.success) {
				placeActivite( data.retour, trConduct );
			}
			if(trConduct.nextSibling && synchronise) {
				chargeOdb( strMois, trConduct.nextSibling, true );
			}
			
			return;
		}, "json"
	);
	jqxhr.fail(function(err) {

//		erreurChargeActivite( err.responseText, trConduct );
		
//		( errMsg, trConduct ) {
		var tdCumul = trConduct.querySelector('.cumul-odb'),
			btAffiche = tdCumul.appendChild( document.createElement( 'button' ) ),
			spanAffiche = tdCumul.appendChild( document.createElement( 'span' ) );
			
			spanAffiche.textContent = err.responseText;
			btAffiche.addEventListener('click', function(e) {
				if( confirm(err.responseText, "OK pour recharger") ) {
					btAffiche.parentNode.innerHTML = '';
					chargeOdb( strMois, trConduct, false );
				};
			})
			
			if(trConduct.nextSibling && synchronise) {
				chargeOdb( strMois, trConduct.nextSibling, true );
			}
		return;
	})

	return trConduct;
}

function chargeTt( uneDate, unTableau ) {

//	jqxhr = $.post("./php/getDrivers.php", param,
	var	param = { mois: [ uneDate.getFullYear(), uneDate.getMonth() + 1 ].join('-') },
//		jqxhr = $.post("./data/getDrivers.json",
		jqxhr = $.post( document.body.dataset.drivers, 
			param,
			function(data){
				document.getElementById('ajax-loader').style.display='none';

				modeleTT = data.result;
				fillBody( modeleTT, unTableau );
				
				return chargeOdb( param.mois, document.querySelector('#table-calendrier tbody tr'), true );
		}, "json");
	
	document.getElementById('ajax-loader').style.display='block';
	
	jqxhr.fail(function(err) {
		alert( err.responseText );
	})
	
	return;
}

function changeMonth( uneDate ) {

	return $.post("./php/joursVacancesMois.php",
		{
			mois: [ uneDate.getFullYear(), ('0' + ( uneDate.getMonth() + 1 )).slice(-2) ].join(''),
			zone: 'A'
		},
		function( data ) {
			return chargeTt( uneDate, fillRowTHeader( uneDate, document.querySelector('#table-calendrier thead tr'), data ) );
		},
		"json"
	);
	
//	return chargeTt( uneDate, fillRowTHeader( uneDate, document.querySelector('#table-calendrier thead tr'), [] ) );
}

function cancel(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}

function affichePlagesNuit(eltTable, unForm) {
	var // eltTable = document.getElementById('table-hrNuit'),
		sectionHrNuits = eltTable.parentElement,
		listTr = eltTable.querySelectorAll('tbody tr'),
		listCellsHead = eltTable.querySelectorAll('thead tr th'),
		nbConduct = listTr.length,
		traiteLigneConduct = function( eltTr, data, arrIdMois ){
			var listCell = eltTr.querySelectorAll('td'),
				idConduct = listCell[0].dataset.idtransics,
				dataConduct = data[idConduct],
				nbJours,
				dummy, totalHr,
				totalJour;
				
			if(dataConduct != undefined) {
				totalHr = 0;

				arrIdMois.forEach(function(item, ind){
					dummy = dataConduct[ item ],
					nbJours = (dummy != undefined) ? +dummy.nbJours : 0;
				
					listCell[ind + 1].textContent = nbJours > 0 ? nbJours : '';
					totalHr += nbJours;
					
					return;
				});
				listCell[13].textContent = totalHr;
			}
		},
		afficheVue = function(data, tabAnMois) {
			var arrHeader = function(dateRef){
					var arr = [],
						indMois, moisCourant;
						
					for(indMois = 0 ; indMois < 12 ; indMois++ ) {
						moisCourant = dateRef.getMonth() + 1;
						arr.push( [ dateRef.getFullYear(), ('0' + moisCourant).slice(-2) ].join('-') ) ;
						listCellsHead[ indMois + 1 ].textContent = [ ('0' + moisCourant).slice(-2), dateRef.getFullYear() ].join('-');
						dateRef.setMonth(moisCourant);
					}
					
					return arr;
				},
				arr = arrHeader( new Date(tabAnMois[1], tabAnMois[0] - 1, 1) ),
				i;
				
			modeleTT.forEach( function(item){
				item.hrNuit =  data[item.PersonTransicsID];
			});

			document.getElementById('pdfHrsNuits').data = pdfJoursPenibilite( modeleTT, arrHeader( new Date(tabAnMois[1], tabAnMois[0] - 1, 1) ) );
			
			for( i = 0 ; i < nbConduct ; i++ ) {
				traiteLigneConduct( listTr[i], data, arr );
			}
			
		},
		chargeModele = function() {
			var uri = './services/stat/heuresNuit',
				xhrHrNuit = new XMLHttpRequest(),
				splitMois = unForm.moisRef.value.toIntArray(),
				strMois = splitMois[1] + ('0' + splitMois[0]).slice(-2);
				
			xhrHrNuit.open('GET', uri + '?mois=' + strMois, true);
			xhrHrNuit.onreadystatechange = function () {
			  var DONE = 4, // readyState 4 means the request is done.
				  OK = 200, // status 200 is a successful return.
				  responseObject = null;
			  switch( xhrHrNuit.readyState ) {
				case 1 :
//						loaderStyle.backgroundColor = 'red';
					break;
				case 2 :
//						loaderStyle.backgroundColor = '#FFA500';
					break;
				case 3 :
//						loaderStyle.backgroundColor = '#00A5ff';
					break;
				case DONE :
//						loaderStyle.backgroundColor = 'blue';
//						loaderStyle.display = 'none';
					if(xhrHrNuit.status === OK) {
						try {
							responseObject = JSON.parse(xhrHrNuit.responseText);
							
						} catch (e) {
						  alert("Parsing error:", e); 
						}
						afficheVue(responseObject, splitMois);
					} else {
					  alert('Error: ' + xhrHrNuit.status); // An error occurred during the request.
					};
					document.getElementById('ajax-loader').style.display = 'none';
					break;
					
				default: ;
			  }
			};	
			
			document.getElementById('ajax-loader').style.display = 'block';
			
			return xhrHrNuit.send();
		}

	winManager.domFenetre( 'Récapitulatif des Heures de Nuit', sectionHrNuits, null, { x:136, y:120, width:820, height: 460 }, true );
	
	sectionHrNuits.style.display = 'block';
	sectionHrNuits.parentNode.style.overflow = 'scroll';
	
	unForm.addEventListener( 'submit', function(e) {
		e.preventDefault();
		
		return chargeModele();
	});
	
	return;
}
/*
 * Demarrage de l'application
 */
window.addEventListener('load', function() {

	/**
	 * Traitement de window.location.search pour extraire la date
	 */
	var s = window.location.search,
		tab = ( s.length ) ? s.split('=') : [],
		dateParts = ( tab.length > 1 ) ? tab[1].toIntArray() : [],
		dateRef = ( dateParts.length == 2 ) ? new Date( dateParts[1], dateParts[0] - 1, 1 ) : new Date(),
		inputMois = document.getElementById('input-mois');

	inputMois.value = [dateRef.getMonth() + 1, dateRef.getFullYear()].join( '-' );

	/*
	 * Affichage de la fenêtre de gestion des types d'arret de travail
	 */
	document.getElementById('btnEditTypeAT').addEventListener( 'click', function() {
		var eltTable = document.getElementById("table-typeAT");
		
		winManager.domFenetre( 'Types Arrêt de Travail', eltTable, null, { x:136, y:120, width:424, height: 620 }, true );
		eltTable.style.display = 'block';
		
		return;
	});
	
	document.getElementById('btnHrNuit').addEventListener('click', function() {
		return affichePlagesNuit(document.getElementById('table-hrNuit'), document.forms['form-hrNuit']); 
	});
	
	monthPickerFactory.createMonthPicker( document.forms['form-hrNuit'].moisRef );
//	documentforms['form-hrNuit'].moisRef.value = [ ( '0' + ( dateRef.getMonth() + 1 ) ).slice(-2), dateRef.getFullYear() ].join('/');


	/*
	 * Affichage du pdf planning
	 */
	document.getElementById('btnImprime').addEventListener( 'click', function() {
		return domFenetrePdf( pdfPlanning( document.getElementById('table-calendrier'), gridAT.tabTypeAt() ), 'Planning des Absences' );
	});
	
	return changeMonth( dateRef );
});

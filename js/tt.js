/**
 * tt.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
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
 *
 * Affichage du planning client
 * 
 * Ajax : 
 * - getDrivers.php
 * - syntheseActiDriver.php
 * - crudArretTravail.php
 * - crudDriver.php
 * -./php/joursVacancesMois.php
 *
 * A Faire
 * - gerer le rechargement quand il y a un erreur de timeout au chargement des temps de travail
 * - afficher les jours fériés en édition
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 
var	modeleTT = null;

var	tabJourOuvres = [],
	nbJourRestant = 0;
 
function estFerie( uneDate ) {
	var estFerie = false;

	if( ( uneDate.getMonth() == 0 && uneDate.getDate() == 1 )
		|| ( uneDate.getMonth() == 4 && uneDate.getDate() == 1 )
		|| ( uneDate.getMonth() == 4 && uneDate.getDate() == 8 )
		|| ( uneDate.getMonth() == 6 && uneDate.getDate() == 14 )
		|| ( uneDate.getMonth() == 7 && uneDate.getDate() == 15 )
		|| ( uneDate.getMonth() == 10 && uneDate.getDate() == 1 )
		|| ( uneDate.getMonth() == 10 && uneDate.getDate() == 11 )
		|| ( uneDate.getMonth() == 11 && uneDate.getDate() == 25 )
		
//		|| ( uneDate.getDay() == 0 )
	) {
		estFerie = true;
	} else {
		var datePaques = Date.easterDay( uneDate.getFullYear() );
        
        // Lundi de Paques
        datePaques.setDate(datePaques.getDate() + 1);  
        estFerie = datePaques.getMonth() == uneDate.getMonth() && datePaques.getDate() == uneDate.getDate();
        
        if( !estFerie ) {
			// ascension
			datePaques.setDate(datePaques.getDate() + 38);  
			estFerie = datePaques.getMonth() == uneDate.getMonth() && datePaques.getDate() == uneDate.getDate();

			if( !estFerie ) {
				// pentecote
				datePaques.setDate(datePaques.getDate() + 11);  
				estFerie = datePaques.getMonth() == uneDate.getMonth() && datePaques.getDate() == uneDate.getDate();
			}
        }
        
	}
	
	return estFerie;
}


/* 
 * Remplie le Header de la table planning
 */
function fillRowTHeader( dateCal, tr, dataVacances ) {

	var today = new Date(),
		dateRef = new Date(+dateCal),
		monthRef = dateRef.getMonth(),
		strMonth = [ dateRef.getFullYear(), monthRef + 1 ].join( '-' ),
		libMois = Date.monthNames()[monthRef],
		th1, th;
	
	tabJourOuvres = [];
	
	tr.innerHTML ='<th>' + libMois + ' ' + dateRef.getFullYear() + '</th>'
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
			divJour = th.appendChild( document.createElement('div') ),
			divMois = th.appendChild( document.createElement('div') );
		
		th.classList.add("day");
		th.dataset.jour = dateRef.getDay();
		if( dataVacances.indexOf(jourMois) >= 0 ) {
			th.classList.add("vacances");
		};
		divJour.textContent = jourMois;
		divMois.textContent = libMois;
		if( estFerie( dateRef ) ) {
			th.classList.add("ferie");
//			tabJourOuvres.push(0);
			tabJourOuvres.push(null);
		} else {
			tabJourOuvres.push( dateRef.getDay() * ( ( dateRef >= today ) ? 1 : -1 ) );
		}
	}
	
	nbJourOuvre = nbJourRestant = 0;
	for( var i = 0 ; i < tabJourOuvres.length ; i++ ) {
		if( Math.abs(tabJourOuvres[i]) > 0 && Math.abs(tabJourOuvres[i]) < 6) {
			nbJourOuvre++;
		}
		if( tabJourOuvres[i] > 0 && Math.abs(tabJourOuvres[i]) < 6) {
			nbJourRestant++;
		}
	}
	
	th = th.nextSibling;
	th.appendChild( document.createElement('small') ).textContent = ( nbJourOuvre - nbJourRestant ) + " jours";
	
	th = th.nextSibling;
	th.appendChild( document.createElement('small') ).textContent = nbJourOuvre + " jours";
	
	th = th.nextSibling;
	th.appendChild( document.createElement('small') ).textContent = nbJourRestant + " jours";
	
	return tabJourOuvres;
}

// Formate une durée en seconde vers heure + minute
function sec2time( val ) {
	var ret = "";
	
	if(val > 0){
		var s = val % 60,
			m = (( val - s ) / 60) % 60,
			h = ( val - ( 60 * m ) - s ) / 3600;
//		ret = "" + h + "h" + ("0" + m).slice(-2) + "'" + ("0" + s).slice(-2);
		ret = "" + h + "h" + ("0" + m).slice(-2);
	}
	
	return ret;
}

function handleDragOver(e) {
  // this / e.target is the current hover target.
  this.classList.add('over-drop');
}
function handleDragLeave(e) {
  this.classList.remove('over-drop');  // this / e.target is previous target element.
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
					
					cibleDrop( td );

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
		depassement = ( parseInt(ds.cumul_tt_mois) + defautTTJour * 3600 * ( nbJourRestant - parseInt(ds.cumul_at) ) ) - parseInt(ds.quota_secondes);
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
		nodesDay.item( i ).classList.remove( "rouge" );
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
		quota_secondes = dataConduct.tempsMaxi * 3600; // Maxi tt par conducteur en seconde -> heure
	
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
	td = trConducteur.appendChild( document.createElement('td') );
	
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
	drops = tbody.querySelectorAll('td.day:empty');
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
		dtJour = new Date();
	
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

//		jqxhr = $.post("./php/getDrivers.php", param,
//	 jqxhr = $.post("./data/getDrivers.json", param,
	var	param = { mois: [ uneDate.getFullYear(), uneDate.getMonth() + 1 ].join('-') },
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
	/** a retablir */
	return $.post("./php/joursVacancesMois.php",
		{ mois: [ uneDate.getFullYear(), ('0' + ( uneDate.getMonth() + 1 )).slice(-2) ].join('') },
		function( data ) {
			chargeTt( uneDate, fillRowTHeader( uneDate, document.querySelector('#table-calendrier thead tr'), data ) );
		},
		"json"
	);
	
	return chargeTt( uneDate, fillRowTHeader( uneDate, document.querySelector('#table-calendrier thead tr'), [] ) );
}

function cancel(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
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
		
		winManager.domFenetre( 'Types Arrêt de Travail', eltTable, null, { x:136, y:120, width:424, height: 560 }, true );
		eltTable.style.display = 'block';
		
		return;
	});
	/*
	 * Affichage du pdf planning
	 */
	document.getElementById('btnImprime').addEventListener( 'click', function() {
		return domFenetrePdf( pdfPlanning( document.getElementById('table-calendrier'), gridAT.tabTypeAt() ), 'Planning des Absences' );
	});
	
	return changeMonth( dateRef );
});

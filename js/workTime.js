/**
 * workTime.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013-2014
 * @date       16/10/2013
 * @version    0.8
 * @revision   $7$
 *
 * @date revision  28/11/2013 gestion background et couleur de fonte
 * @date revision  09/12/2013 gestion des modifications du taReel
 * @date revision 27/01/2014 saisie du code Optigest
 * @date revision 29/01/2014 traitement des imports Optigest
 * @date revision 08/05/2014 Edition côté client
 * @date revision 20/05/2014 Tableau des Heures Dues
 * @date revision 26/06/2014 Tableau des Heures Dues : gestion de la colonne ajust
 *
 * Gestion des tableau de relevés d'activité mensuels, et des heures dues
 *
 * Appel :
 * - ./php/syntheseActiDriver.php
 * - ./php/getRecapTpsServ.php"
 * - ./php/validRecap.php"
 * - ./php/crudDriver.php
 *
 * A Faire : 
 * Message validation
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */


var mvcConducteur = (function ( document ) {
	var dateReleve = new Date(),
		tabTrConduct = {},
		tabDuEntreprise = {},
/*		idConducteur = null,
		formConducteur = document.forms['conducteur'],
		clickListConducteur = function( event ) {
			var span_conduct = event.currentTarget.querySelectorAll( 'span');
			
			formConducteur.nom.value = span_conduct[0].textContent;
			formConducteur.code.value = span_conduct[1].textContent;
			formConducteur.id.value = span_conduct[2].textContent;
			
			return;
		}, 
		chargeRecap = function( ) {
			var	strMois = dateReleve.getFullYear() + '-' + ('0' + (dateReleve.getMonth() + 1)).slice(-2);

			$.post("./php/syntheseActiDriver.php",
				{ mois: strMois }, 
				function(data){
					if(data.success) {
					}
					return;
				}, "json"
			);

		},*/
		
		/**
		 * Chargement du temps de Travail pour un conducteur
		 */
		chargeTaConduct = function( trConduct, boolContinue ) {
		//--------------------
			var	idTransics = trConduct.dataset.idTransics,
				tds = trConduct.querySelectorAll('td'),
				strMois = dateReleve.getFullYear() + '-' + ('0' + (dateReleve.getMonth() + 1)).slice(-2),
				tabDate = strMois.split('-'),
				dateRef = new Date( +tabDate[0], +tabDate[1], 0),
				hiddenTmpServ = tds[4].firstChild,
				inputTmpServ = hiddenTmpServ.nextSibling;

			if( !boolContinue  || ( !(trConduct.style.display == 'none') && !( hiddenTmpServ.value > 0 ) ) ) {
			
				inputTmpServ.classList.add('load');
				
				$.post("./php/syntheseActiDriver.php", { // construction du parametre
						dateInf: strMois + '-01',
						dateSup: strMois + '-' + dateRef.getDate(),
						idDriver: idTransics
					}, 
					function(data){
						if(data.success) {
							var tabActi = data.retour,
								typeActi = ['A', 'O'],
								totActi = 0;
							
							for (acti in tabActi) {
								for( var t = 0, lgth = typeActi.length ; t < lgth ; t++ ) {
									var data = tabActi[acti],
										valActi = data[ typeActi[t] ] || 0;
									
									if( valActi > 0 ) {
										totActi += valActi;
									}
								}
							}
							hiddenTmpServ.value = ( totActi / 3600 ).toFixed(2);
							if( !(inputTmpServ.value > 0) ) {
								inputTmpServ.value = hiddenTmpServ.value;
							}
							inputTmpServ.classList.remove('load');
							mvcConducteur.calLigneConduct(inputTmpServ.parentNode.parentNode);

						} else {
						}
						
						if(trConduct.nextSibling && boolContinue) {
							chargeTaConduct( trConduct.nextSibling, true );
						} else {
//							document.getElementById('bt_enregistrer').disabled = false;
						}
						
						return;
					}, "json"
				);
			} else {
				if(trConduct.nextSibling) {
					chargeTaConduct( trConduct.nextSibling, boolContinue );
				} else {
//					document.getElementById('bt_enregistrer').disabled = false;
				}
			}
			
			return trConduct;
		},
		enregistreRecap = function( event, tbody ) {
		//--------------------
			var trs = tbody.querySelectorAll('tr'),
				nbTr = trs.length,
				tabValeur = [], // Parametre POST
				btn = event.target;
				
			btn.disabled = true;
			document.getElementById('ajax-loader').style.display = 'block';
			
			for( var i = 0 ; i < nbTr ; i++ ) {
			
				var tr_conduct = trs[i],
					tds = tr_conduct.querySelectorAll('td'),
					tdInputTA = tds[4].querySelectorAll('input');

				tabValeur.push({
					idTransics: tr_conduct.dataset.idTransics,
					conduiteDisque: tds[1].firstChild.value, 
					totalDisque: tds[3].firstChild.value,
					taReel: tdInputTA[0].value,
					taReelModif: tdInputTA[1].value,
					modifDisque: tds[7].firstChild.value
				});
			}
			$.post("./php/validRecap.php", { // construction du parametre
					cmd: 'validRecap',
//					mois: dateReleve.getFullYear() + '-' + ( '0' + (dateReleve.getMonth() + 1) ).slice(-2),
					mois: [ dateReleve.getFullYear(), ( '0' + (dateReleve.getMonth() + 1) ).slice(-2) ].join('-'),
					data: tabValeur
				}, 
				function(data){
					if(data.success) {
						btn.disabled = false;
						document.getElementById('ajax-loader').style.display='none';
						alert('Les saisies ont été validées');  
						return;
					} else {
						alert('Erreur', '');  
					}
				}, "json"
			);
			
			return;
		},
		/**
		  * validation des heures dues
		  */
		enregistreHeureDues = function( event, tbody ) {
		//--------------------------
			var trs = tbody.querySelectorAll('tr'),
				nbTr = trs.length,
				tabValeur = [], // Parametre poste
				btn = event.target;
				
			btn.disabled = true;
			for( var i = 0 ; i < nbTr ; i++ ) {
			
				var tr_conduct = trs[i],
					tds = tr_conduct.querySelectorAll('td'),
					inputs = tr_conduct.querySelectorAll('input');

				// Construction du paramètre
				if( tr_conduct.style.display != 'none' )
				tabValeur.push({
					idTransics: tr_conduct.dataset.idTransics,
					// On transmet l'ensemble des parametres sous forme de chaine json
					// pour éviter un trop grand nombre de variables _POST
					param : JSON.stringify( {
						soldeHrPrec1: tds[1].firstChild.value, 
						soldeHrPrec2: tds[1].firstChild.nextSibling.value,
						soldeMtPrec1: tds[2].firstChild.value, 
						soldeMtPrec2: tds[2].firstChild.nextSibling.value,
						pxHrDisque1: tds[3].firstChild.value,
						pxHrDisque2: tds[3].firstChild.nextSibling.value,
						duEntreprise1: tds[4].firstChild.value,
						duEntreprise2: tds[4].firstChild.nextSibling.value,
						duEntrepriseAjust: tds[5].firstChild.nextSibling.value,
						duConductHr1: tds[9].firstChild.value,
						duConductHr2: tds[9].firstChild.nextSibling.value,
						duConductMt1: tds[11].firstChild.value,
						duConductMt2: tds[11].firstChild.nextSibling.value,
						primeA1: tds[12].firstChild.value,
						primeA2: tds[12].firstChild.nextSibling.value,
						primeB1: tds[13].firstChild.value,
						primeB2: tds[13].firstChild.nextSibling.value
					})
				});
			}
			$.post("./php/validRecap.php", { // construction du parametre
					cmd: 'validHrDues',
					mois: dateReleve.getFullYear() + '-' + ( '0' + (dateReleve.getMonth() + 1) ).slice(-2),
					data: tabValeur
				}, 
				function(data){
					if(data.success) {
						btn.disabled = false;

						return;
					}
				}, "json"
			);
			
			return nbTr;
		}
		vueConducteur = function( modele, tbodyRecap ) {
			var nbConducteur = modele.length,
	//			dataTable = [],
				
				/*
				  * Gestion du drag drop
				  */
				cancel = function(e) {
				  if (e.preventDefault) {
					e.preventDefault();
				  }
				  return false;
				},
				handleDragOver = function(e) {
				  // this / e.target is the current hover target.
				  this.classList.add('over-drop');
				},
				handleDragLeave = function(e) {
				  this.classList.remove('over-drop');  // this / e.target is previous target element.
				},
				// Gere le drop d'une couleur sur une line de la table
				cibleDrop = function( item ) {

					item.addEventListener('dragover', handleDragOver, false);
					item.addEventListener('dragleave', handleDragLeave, false);
					item.addEventListener('dragover', cancel);
					item.addEventListener('drop', function (e) {
						
						e.preventDefault(); // stops the browser from redirecting off to the text.
						
						var dataCoul = e.dataTransfer.getData('Text'),
							bg = ( dataCoul.indexOf('bg', 0) > -1 ),
							couleur = bg ? dataCoul.substr(2) : dataCoul;
						
						couleur = couleur.length ? '#' + couleur : '';
						
						$.post("./php/crudDriver.php",
							{
								cmd: 'updateColor',
								transicsId: this.querySelector('td').querySelector('span.idTransics').textContent,
								couleur: couleur,
								bg: bg ? 1 : 0,
							},
							function(data){ 
								return mvcConducteur.coloreTrConduct( item, bg ? couleur : null, bg ? null : couleur );
							},
							"json"
						);
						return false;
					});
					return;
				},
				/**
				 * Validation des saisies dans la colonne optigest
				 */
				validCodeOptigest = function( e ) {
					var input = e.target,
						id = input.parentNode.parentNode.dataset.idTransics;
						
					return $.post("./php/crudDriver.php",
								{ cmd:'updateJointure', transicsId:id, optigestId: input.value },
								function(data){

								}, "json"
							);
				},
				createInput = function( unType ) {
					var elmt = document.createElement('input');
					
					elmt.setAttribute( 'type', unType || 'text' );
					return elmt;
				},
				calcTrHrDuesConduct = function( conduct ) {
					var tr_conduct = document.createElement('tr'),
						recapTpsService = conduct.recapTpsService,
						soldeHrPrec1 = +( recapTpsService.soldeHrPrec1 || 0 ),
						soldeHrPrec2 = +( recapTpsService.soldeHrPrec2 || 0 ),
						pxHr1 = +( recapTpsService.pxHr1 || 0 ),
						pxHr2 = +( recapTpsService.pxHr2 || 0 ),
						td_conduct = tr_conduct.appendChild( document.createElement('td') ),
						
						inputSoldePrecHr1 = createInput( 'text' ),
						inputSoldePrecHr2 = createInput( 'text' ),
						outputSoldePrecMt1 = document.createElement('output'),
						outputSoldePrecMt2 = document.createElement('output'),
						inputPxHr1 = createInput( 'text' ),
						inputPxHr2 = createInput( 'text' ),
						inputPbqdHr1 = createInput( 'text' ),
						inputPbqdMt1 = createInput( 'text' ),
						inputSoldeHr1 = createInput( 'text' ),
						inputSoldeMt1 = createInput( 'text' ),
						inputTotalHr1 = createInput( 'text' ),
						inputTotalMt1 = createInput( 'text' ),
						inputSoldeHr2 = createInput( 'text' ),
						inputSoldeMt2 = createInput( 'text' ),
						outputDuEntreprise = document.createElement('output'),
						inputAjustDuEntreprise = createInput( 'text' ),
						inputPbqdMt2 = createInput( 'text' ),
						inputTotalHr2 = createInput( 'text' ),
						inputTotalMt2 = createInput( 'text' );
						
					tr_conduct.dataset.idTransics = conduct.PersonTransicsID;
					/* Colonne identité Conducteur */
					td_conduct.appendChild( document.createElement('span') ).textContent = conduct.Lastname.toLowerCase();
					td_conduct.appendChild( document.createElement('span') ).textContent = conduct.PersonExternalCode;
					td_conduct.appendChild( document.createElement('br') );
					td_conduct.appendChild( document.createElement('span') ).textContent = conduct.Firstname.toLowerCase();
					td_conduct.appendChild( document.createElement('output') ).value = conduct.ContactInfo.Address.ZipCode;

					
					// solde precedent
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( inputSoldePrecHr1 ).value = soldeHrPrec1.toFixed(2);
					td_conduct.appendChild( inputSoldePrecHr2 ).value = soldeHrPrec2.toFixed(2);
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( outputSoldePrecMt1 );
					td_conduct.appendChild( outputSoldePrecMt2 );
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( inputPxHr1 ).value = pxHr1.toFixed(2);
					td_conduct.appendChild( inputPxHr2 ).value = pxHr2.toFixed(2);
					
					// du pbqd
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.className = 'little';
					td_conduct.appendChild( document.createElement('output') ).value = 0;
//					td_conduct.appendChild( document.createElement('br') );
//					td_conduct.appendChild( outputDuEntreprise ).value = conduct.recapTpsService.duEntreprise2;
					td_conduct.appendChild( outputDuEntreprise ).value = 
						tabTrConduct[conduct.PersonTransicsID].lastChild.firstChild.value;
					tabDuEntreprise[conduct.PersonTransicsID] = outputDuEntreprise;

					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.className = 'little';
					td_conduct.appendChild( createInput( 'text' ) ).value = 0;
					td_conduct.appendChild( inputAjustDuEntreprise ).value = conduct.recapTpsService.duEntrepriseAjust;
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') ).value = 0;
					td_conduct.appendChild( document.createElement('output') ).value = 0;
					
					// total
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') );
					td_conduct.appendChild( document.createElement('output') );
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') );
					td_conduct.appendChild( document.createElement('output') );
					
					// dues conducteur
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.className = 'little';
					td_conduct.appendChild( createInput( 'text' ) ).value = conduct.recapTpsService.duConductHr1;;
					td_conduct.appendChild( createInput( 'text' ) ).value = conduct.recapTpsService.duConductHr2;
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') );
					td_conduct.appendChild( document.createElement('output') );
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( createInput( 'text' ) ).value = conduct.recapTpsService.duConductMt1;
					td_conduct.appendChild( createInput( 'text' ) ).value = conduct.recapTpsService.duConductMt2;

					// prime
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( createInput( 'text' ) ).value = conduct.recapTpsService.primeA1;
					td_conduct.appendChild( createInput( 'text' ) ).value = conduct.recapTpsService.primeA2;
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( createInput( 'text' ) ).value = conduct.recapTpsService.primeB1;
					td_conduct.appendChild( createInput( 'text' ) ).value = conduct.recapTpsService.primeB2;

					// solde
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') ).classList.add('color-red');
					td_conduct.appendChild( document.createElement('output') ).classList.add('color-red');
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') );
					td_conduct.appendChild( document.createElement('output') );
					
					
					// prime a+b
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') );
					td_conduct.appendChild( document.createElement('output') );
					
					tr_conduct.appendChild( document.createElement('td') );

					mvcConducteur.calLigneHrDues(tr_conduct);
							
					if(conduct.tempsMaxi == 0) {
						tr_conduct.style.display = 'none';
					} else {
						mvcConducteur.coloreTrConduct( tr_conduct,
							( conduct.bgcolor || '' ).length ? conduct.bgcolor : null,
							( conduct.color || '' ).length ? conduct.color : null
						);
					}
					return tr_conduct;
				};

				calcTrRecapConduct = function( conduct ) {
					var tr_conduct = document.createElement('tr'),
						td_conduct = tr_conduct.appendChild( document.createElement('td') ),
						inputIdentOptigest = document.createElement('input'),
						inputConduiteDisque = document.createElement('input'),
						inputTotalDisque = document.createElement('input'),
						hiddenTaReel = document.createElement('input'),
						inputTaReel = document.createElement('input'),
						btnCalcTaReel = document.createElement('button'),
						inputModifDisque = document.createElement('input');
					
					tr_conduct.dataset.idTransics = conduct.PersonTransicsID;
					/* Colonne Conducteur */
					td_conduct.appendChild( document.createElement('span') ).textContent = conduct.FormattedName.toLowerCase();
					td_conduct.appendChild( document.createElement('span') ).textContent = conduct.PersonExternalCode;
					
					/* Gere la Saisie du Code Optigest */
					td_conduct.appendChild( inputIdentOptigest ).value = conduct.idOptigest || '';
					inputIdentOptigest.addEventListener( 'click', pxUtil.selectOnClick );
					inputIdentOptigest.addEventListener( 'change', validCodeOptigest );
					inputIdentOptigest.disabled = true;

					td_conduct.appendChild( document.createElement('span') ).textContent = conduct.PersonTransicsID;
					td_conduct.lastChild.classList.add('idTransics');

					// conduite_disque
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( inputConduiteDisque ).setAttribute( 'type', 'text' );
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') );
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( inputTotalDisque );
					inputTotalDisque.setAttribute( 'type', 'text' );
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') )
					td_conduct.appendChild( hiddenTaReel ).setAttribute( 'type', 'hidden' ); // ta réel
					td_conduct.appendChild( inputTaReel ).setAttribute( 'type', 'text' ); // ta réel
					inputTaReel.addEventListener( 'click', pxUtil.selectOnClick );
					td_conduct.appendChild( btnCalcTaReel );
					btnCalcTaReel.addEventListener( 'click', function( e ) {
							e.preventDefault();
							
							return mvcConducteur.chargeTaTrConduct( tr_conduct, false );
						}
					);
					btnCalcTaReel.classList.add('btn-ttTransics');

					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') ); // tot réel
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') ); // % conduite
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( inputModifDisque ).setAttribute( 'type', 'text' );
					
					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') ); // % conduite

					td_conduct = tr_conduct.appendChild( document.createElement('td') );
					td_conduct.appendChild( document.createElement('output') ); // % -

//					coloreTrConduct( tr_conduct,
					mvcConducteur.coloreTrConduct( tr_conduct,
								( conduct.bgcolor == undefined ) ? null : ( (conduct.bgcolor.length) ? conduct.bgcolor : null ),
								( conduct.color == undefined ) ? null : ( (conduct.color.length) ? conduct.color : null )
					);

					if(conduct.tempsMaxi == 0) {
						tr_conduct.style.display = 'none';
					} else {
//						cibleDrop( trConduct );

						if( conduct.recapTpsService != undefined ) {
							var recap = conduct.recapTpsService;
							
							inputConduiteDisque.value = (recap.conduiteDisque > 0) ? recap.conduiteDisque : '';
							inputTotalDisque.value = (recap.totalDisque > 0) ? recap.totalDisque : '';
							hiddenTaReel.value = recap.taReel;
							inputTaReel.value = (recap.taReelModif > 0) ? recap.taReelModif : (recap.taReel > 0) ? recap.taReel : '';
							inputModifDisque.value = (recap.modifDisque != 0) ? recap.modifDisque : ''; recap.modifDisque;
							
							mvcConducteur.calLigneConduct(tr_conduct);
						}
					}
					
					return tr_conduct;
				},
				/*
				 * Construction des tables 
				 * pour chaque conducteur, on construit 
				 * - un element tr dans tbodyRecap
				 * - un element tr dans tbody_hrDues
				 */
				traiteConducteur = function( item ) {
					
					tabTrConduct[item.PersonTransicsID] = tbodyRecap.appendChild( calcTrRecapConduct(item) );
					cibleDrop( tbodyRecap.lastChild );
					
					if( item.recapTpsService != undefined ) {
	//					tabHrDuConduct[modele[i].PersonTransicsID] = 
							document.getElementById('tbody_hrDues').appendChild( calcTrHrDuesConduct(item) );
					}
					return;
				};
			
			modele.forEach(traiteConducteur);
/*			
			for( var i = 0 ; i < nbConducteur ; i++ ) {

				tabTrConduct[modele[i].PersonTransicsID] = tbodyRecap.appendChild( calcTrRecapConduct( modele[i] ) );
				cibleDrop( tbodyRecap.lastChild );
				
				if( modele[i].recapTpsService != undefined ) {
//					tabHrDuConduct[modele[i].PersonTransicsID] = 
						document.getElementById('tbody_hrDues').appendChild( calcTrHrDuesConduct( modele[i] ) );
				}
			}
*/			
			return;
		};
		/**
		 * Chargement des données et constitution du modele
		 */
		chargeReleve = function( dt ) {
			dateReleve = dt;
			document.getElementById('input-mois').value = [ ( '0' + (dt.getMonth() + 1) ).slice(-2), dt.getFullYear() ].join('-');
			
			document.getElementById('bt_enregistrer').disabled = true;
			$.post("./php/getRecapTpsServ.php", { // construction du parametre
//			$.post("./data/getRecapTpsServ.json", { // construction du parametre
					mois: [ dt.getFullYear(), ( '0' + (dt.getMonth() + 1) ).slice(-2)].join('-'),
					flagTmpsService: 0
				}, 
				function(data){
					if(data.succes) {
						vueConducteur( data.result, document.getElementById('table-recap').querySelector('tbody') );
						chargeTaConduct(document.getElementById( 'table-recap').querySelector('tbody tr'), true );
						document.getElementById('bt_enregistrer').disabled = false;
						
						return;
					}
				}, "json"
			);
		},

		vueHeuresDues = function( modele, tbodyRecap ) {
		
			return;
		};
		
	return {
		loadModele: chargeReleve,
		idConducteur: function( ) {
			return formConducteur.id.value;
		},
		chargeTaTrConduct: chargeTaConduct,
		calLigneConduct: function( trConduct ) {
			var	idTransics = trConduct.dataset.idTransics,
				tds = trConduct.querySelectorAll('td'),
				totalDisque = parseFloat( tds[3].firstChild.value ),
				conduiteDisque = parseFloat( tds[1].firstChild.value ),
				taDisque = Math.max( 0, totalDisque - conduiteDisque ),
				taReel = parseFloat( tds[4].firstChild.value ),
				taReelModif = parseFloat( tds[4].firstChild.nextSibling.value ),
				totalReel = conduiteDisque + ( taReelModif > 0 ? taReelModif : taReel ),
				pcConduite = Math.round( 100 * conduiteDisque / totalReel ),
				modifDisque = parseFloat( tds[7].firstChild.value );
			
			modifDisque = isNaN(modifDisque) ? 0 : modifDisque;
			
			tds[2].firstChild.value = isNaN(taDisque) ? '' : taDisque.toFixed(2);
			tds[5].firstChild.value = isNaN(totalReel) ? '' : totalReel.toFixed(2);
			tds[6].firstChild.value = isNaN(pcConduite) ? '' : pcConduite;
			tds[8].firstChild.value = ( modifDisque > 0) ? Math.round( 100 * conduiteDisque / modifDisque ) : '';
			tds[9].firstChild.value = Math.round( ( (modifDisque > 0) ? modifDisque : totalReel ) - totalDisque ) || 0;
			if( tabDuEntreprise[idTransics] != undefined ) {
				tabDuEntreprise[idTransics].value = tds[9].firstChild.value;
			}
			return trConduct;
		},
		calLigneHrDues: function( trConduct ) {
			var	idTransics = trConduct.dataset.idTransics,
				tds = trConduct.querySelectorAll('td'),
				soldeHrPrec1 = parseFloat( tds[1].firstChild.value ),
				soldeHrPrec2 = parseFloat( tds[1].firstChild.nextSibling.value ),
				pxHr1 = Number( tds[3].firstChild.value ),
				pxHr2 = Number( tds[3].firstChild.nextSibling.value );
				duEntreprise1 = parseFloat( tds[4].firstChild.value ),
				duEntreprise2 = parseFloat( tds[4].firstChild.nextSibling.value ),
				duEntrepriseAjust = Number( tds[5].firstChild.nextSibling.value ),
				primeA = Number( tds[11].firstChild.nextSibling.value ),
				primeB = Number( tds[12].firstChild.nextSibling.value ),
				primeC = Number( tds[13].firstChild.nextSibling.value ),
				hrSolde = 0,
				trRecap = tabTrConduct[idTransics];
			
			if( trConduct.style.display != 'none' ) {
				// Colonnes solde mois précèdent 			
				tds[2].firstChild.value = isNaN(soldeHrPrec1 * pxHr1) ? 0 : (soldeHrPrec1 * pxHr1).toFixed(2);
				tds[2].firstChild.nextSibling.value = isNaN(soldeHrPrec2 * pxHr2) ? 0 : (soldeHrPrec2 * pxHr2).toFixed(2);

				tds[6].firstChild.value = (tds[4].firstChild.value * pxHr1).toFixed(2);
				tds[6].firstChild.nextSibling.value = (tds[4].firstChild.nextSibling.value * pxHr2).toFixed(2);
				
				// total
				tds[7].firstChild.value = isNaN(soldeHrPrec1 + duEntreprise1) ? 0 : (soldeHrPrec1 + duEntreprise1).toFixed(2);
				tds[7].firstChild.nextSibling.value = isNaN(soldeHrPrec2 + duEntreprise2 + duEntrepriseAjust) ? 0 : (soldeHrPrec2 + duEntreprise2 + duEntrepriseAjust).toFixed(2);

				tds[8].firstChild.value = ( Number( tds[7].firstChild.value ) * pxHr1 ).toFixed(2);
				tds[8].firstChild.nextSibling.value = ( Number( tds[7].firstChild.nextSibling.value ) * pxHr2).toFixed(2);
				
				tds[10].firstChild.value = (tds[9].firstChild.value * pxHr1).toFixed(2);
				tds[10].firstChild.nextSibling.value = (tds[9].firstChild.nextSibling.value * pxHr2).toFixed(2);
				
				tds[15].firstChild.value = (tds[8].firstChild.value
											- tds[10].firstChild.value 
//											- Number( tds[11].firstChild.value ) 
											- Number( tds[12].firstChild.value )
											- Number( tds[13].firstChild.value )
										).toFixed(2);
				tds[15].firstChild.nextSibling.value = (tds[8].firstChild.nextSibling.value 
														- tds[10].firstChild.nextSibling.value 
//														- Number( tds[11].firstChild.nextSibling.value )
														- Number( tds[12].firstChild.nextSibling.value )
														- Number( tds[13].firstChild.nextSibling.value )
														).toFixed(2);
				
				tds[14].firstChild.value = ( tds[15].firstChild.value / pxHr1 ).toFixed(2);
				tds[14].firstChild.nextSibling.value = (tds[15].firstChild.nextSibling.value / pxHr2).toFixed(2);
				
				tds[16].firstChild.nextSibling.value = primeA + primeB;
				
				[ tds[1].firstChild, 
				  tds[1].firstChild.nextSibling, 
				  tds[14].firstChild, 
				  tds[14].firstChild.nextSibling ].forEach(
					function( elt ) { return elt.className = ( elt.value == 0 ) ? 'color-gris' : 'color-red';
				});
			}
			return trConduct;
		},
		calLigneHrDuesOld: function( trConduct ) {
			var	idTransics = trConduct.dataset.idTransics,
				tds = trConduct.querySelectorAll('td'),
				soldeHrPrec1 = parseFloat( tds[1].firstChild.value ),
				soldeHrPrec2 = parseFloat( tds[1].firstChild.nextSibling.value ),
				pxHr1 = Number( tds[3].firstChild.value ),
				pxHr2 = Number( tds[3].firstChild.nextSibling.value );
				duEntreprise1 = parseFloat( tds[4].firstChild.value ),
				duEntreprise2 = parseFloat( tds[4].firstChild.nextSibling.value ),
				ajust = Number( tds[5].firstChild.nextSibling.value ),
				hrSolde = 0;
			
			if( trConduct.style.display != 'none' ) {
				// Colonnes solde mois précèdent 			
				tds[2].firstChild.value = isNaN(soldeHrPrec1 * pxHr1) ? 0 : (soldeHrPrec1 * pxHr1).toFixed(2);
				tds[2].firstChild.nextSibling.value = isNaN(soldeHrPrec2 * pxHr2) ? 0 : (soldeHrPrec2 * pxHr2).toFixed(2);

				tds[6].firstChild.value = (tds[4].firstChild.value * pxHr1).toFixed(2);
				tds[6].firstChild.nextSibling.value = ( ( duEntreprise2 + ajust ) * pxHr2).toFixed(2);
				
				// total
				tds[7].firstChild.value = isNaN(soldeHrPrec1 + duEntreprise1) ? 0 : (soldeHrPrec1 + duEntreprise1).toFixed(2);
				tds[7].firstChild.nextSibling.value = isNaN(soldeHrPrec2 + duEntreprise2 + ajust) ? 0 : (soldeHrPrec2 + duEntreprise2 + ajust).toFixed(2);

				tds[8].firstChild.value = ( Number( tds[7].firstChild.value ) * pxHr1 ).toFixed(2);
				tds[8].firstChild.nextSibling.value = ( Number( tds[7].firstChild.nextSibling.value ) * pxHr2).toFixed(2);
				
				tds[10].firstChild.value = (tds[9].firstChild.value * pxHr1).toFixed(2);
				tds[10].firstChild.nextSibling.value = (tds[9].firstChild.nextSibling.value * pxHr2).toFixed(2);
				
				tds[15].firstChild.value = (tds[8].firstChild.value
											- tds[10].firstChild.value 
											- Number( tds[11].firstChild.value ) 
											- Number( tds[12].firstChild.value )
											- Number( tds[13].firstChild.value )
										).toFixed(2);
				tds[15].firstChild.nextSibling.value = (tds[8].firstChild.nextSibling.value 
														- tds[10].firstChild.nextSibling.value 
														- Number( tds[11].firstChild.nextSibling.value )
														- Number( tds[12].firstChild.nextSibling.value )
														- Number( tds[13].firstChild.nextSibling.value )
														).toFixed(2);
				
				tds[14].firstChild.value = ( tds[15].firstChild.value / pxHr1 ).toFixed(2);
				tds[14].firstChild.nextSibling.value = (tds[15].firstChild.nextSibling.value / pxHr2).toFixed(2);
				
				tds[16].firstChild.value = ( Number( tds[11].firstChild.nextSibling.value ) + Number( tds[12].firstChild.nextSibling.value ) ).toFixed(2);
				
				[ tds[1].firstChild, 
				  tds[1].firstChild.nextSibling, 
				  tds[14].firstChild, 
				  tds[14].firstChild.nextSibling ].forEach(
					function( elt ) { return elt.className = ( elt.value == 0 ) ? 'color-gris' : 'color-red';
				});
			}
			return trConduct;
		},
		calLigne: function(e) { 
			return mvcConducteur.calLigneConduct( e.target.parentNode.parentNode ); 
		},
		coloreTrConduct: function(tr, bgcolor, color ) {
			if(bgcolor != null) {
				if( bgcolor.length ) {
					tr.style.backgroundColor = bgcolor;
				} else {
					tr.style.removeProperty('background-color');
				}
			}
			if(color != null) {
				td_conduct = tr.firstChild;
				while(td_conduct) {
					if( color.length ) {
						td_conduct.style.color = color;
					} else {
						td_conduct.style.removeProperty('color');
					}
					td_conduct = td_conduct.nextSibling;
				}
			}
			
			return tr;
		},
		/**
		 * Traitement des imports Optigest
		 */
		traiteImportOptigest : function( data ) {
			var trElmts = document.getElementById('table-recap').querySelector('tbody').querySelectorAll('tr'),
				nbElmts = trElmts.length;
			
			for (key in data) {
				if (data.hasOwnProperty(key)) {
					
					for( var i = 0 ; i < nbElmts ; i++ ) {
						var inputElmt = trElmts[i].firstChild.querySelector('input');
						
						if( +key == +inputElmt.value ) {
							inputElmt.parentNode.nextSibling.firstChild.value = ( +data[key].tmpConduite / 60 ).toFixed(2);
							inputElmt.parentNode.nextSibling.nextSibling.nextSibling.firstChild.value = ( +data[key].tmpTotDisk / 60 ).toFixed(2);
							
							mvcConducteur.calLigneConduct(inputElmt.parentNode.parentNode);
							
							break;
						}
						
					}
				}
			}
			return;
		},
		/**
		 * Réponse à un click sur le switch Optigest
		 */
		switchEditCodeOptigest: function( e ) {
			var trElmts = document.getElementById('table-recap').querySelector('tbody').querySelectorAll('tr'),
				bloque = !(e.target.checked);
			
			for( var i = trElmts.length - 1 ; i >= 0 ; i-- ) {
			/* Bloque le champ de saisie Optigest */
				trElmts[i].firstChild.querySelector('input').disabled = bloque;
			}
			return bloque;
		},
		saveRecap: function(event) { 
			return enregistreRecap( event, document.getElementById('table-recap').querySelector('tbody') ); 
		},
		saveHrDues: function(event) { 
			return enregistreHeureDues( event, document.getElementById('tbody_hrDues') ); 
		},
		dateTitre: function() { return Date.monthNames()[dateReleve.getMonth()] + ' ' + dateReleve.getFullYear(); }
	};
})(window.document);


window.addEventListener('load', function() {
	/* Chargement de la liste des conducteur */
	var s = window.location.search,
		tab = ( s.length ) ? s.split('=') : [],
		dateParts = ( tab.length > 1 ) ? tab[1].split("-") : [],
		dateRef = ( dateParts.length == 2 ) ? new Date( parseInt(dateParts[1]), parseInt( dateParts[0] - 1 ), parseInt(1) ) : new Date(),
		dragItems = document.querySelectorAll('header div[draggable=true]');

		/**
		 * Gere le dnd des couleur (fond de ligne et catactere)
		 */
	for( var i = dragItems.length ; i > 0 ; i-- ) {
		dragItems[i-1].addEventListener('dragstart', function (event) {
		// store the ID of the element, and collect it on the drop later on
		event.dataTransfer.setData('Text', this.dataset.couleur);
	  });
	}
	

	mvcConducteur.loadModele(dateRef);
	document.getElementById('span-mois').textContent = mvcConducteur.dateTitre();
	document.getElementById('span-mois-hd').textContent = mvcConducteur.dateTitre();
	
	document.forms['frm_tt'].addEventListener('input', function(e){ return mvcConducteur.calLigneConduct(e.target.parentNode.parentNode) });
	document.getElementById('bt_enregistrer').addEventListener('click', mvcConducteur.saveRecap);
	
	document.forms['frm_hd'].addEventListener('input', function(e){ return mvcConducteur.calLigneHrDues(e.target.parentNode.parentNode) });
	document.getElementById('bt_enregHrDues').addEventListener('click', mvcConducteur.saveHrDues);
	
	/*
	 * Gere les éditions
	 */
	document.getElementById('btn_impRecap').addEventListener('click', function() {
		return domFenetrePdf( pdfRecapMensuel( document.getElementById('table-recap') ), 'Récapitulatif Mensuel d\'Activité' );
	});
	document.getElementById('btn_impHeuresDues').addEventListener('click', function() {
		return domFenetrePdf( pdfHeuresDues( document.getElementById('table-hd') ), 'Tableau des Heures Dûes' );
	});
	
	document.getElementById('cb-codeOptiGest').addEventListener('change', mvcConducteur.switchEditCodeOptigest);
	
	document.getElementById("rd_nav_releve").addEventListener('change', function( e ) {
			if( e.target.checked ) {
				document.getElementById("remonte").classList.remove("display-none");
				document.getElementById("heuresDues").classList.add("display-none");
			} else {
				document.getElementById("remonte").classList.add("display-none");
				document.getElementById("heuresDues").classList.remove("display-none");
			} 
		});
		
	/*
	 * Gestion du menubar
	 */
	document.getElementById("rd_nav_heureDues").addEventListener('change', function( e ) {
			if( e.target.checked ) {
				document.getElementById("remonte").classList.add("display-none");
				document.getElementById("heuresDues").classList.remove("display-none");
			} else {
				document.getElementById("remonte").classList.remove("display-none");
				document.getElementById("heuresDues").classList.add("display-none");
			} 
		});
	
	
	return;
});

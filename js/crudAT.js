/**
 * crudAT.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       29/12/2013
 * @version    0.5
 * @revision   $0$
 *
 * @date revision   12/10/2013 Chargement asynchrone des temps OdB
 *
 * Gestion des types d'arret de travail
 * 
 * Ajax : 
 * - ./php/crudTypeAt.php"
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/**
 * gridAT() instanciation de la "grid" de gestion des types AT
 *
 * @param <node> eltTable : le noeud TABLE affichant la liste des items
 * @param <node> ulTypeAT : le noeud UL affichant la liste des items draggables
 * @return <Object> gridAT
 */
var gridAT = (function ( eltTable, ulTypeAT ) {
	var model, // contient la liste des items
		elmtCourant = null,
		formAT = eltTable.querySelector("thead tr form"), // Formulaire création/saisie

		/**
		 * sec2time() returns une duree formaté hhxmm
		 *
		 * @param <int> val : nb minute
		 * @param <String> sep : separateur h/mn
		 * @return <String> 
		 */
		sec2time = function ( val, sep ) {
			var s = val % 60,
				m = (( val - s ) / 60) % 60,
				h = ( val - ( 60 * m ) - s ) / 3600,
				tab = [ h, m, s ].map( function(item) { return ("0" + item).slice(-2) } );

			tab.pop();

			return tab.join(sep);
		},
		// Formate une durée en seconde vers heure + minute
		time2mn = function ( val ) {
			var tab = val.split(':');

			return +tab[0]*60 + ( tab[1] == undefined ? 0 : +tab[1] );
		},
		submitTypeAT = function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			return $.post("./php/crudTypeAt.php",
					{
						cmd: 'update',
						ident: formAT.idTypeAt.value,
						libelle: formAT.inputLibelle.value,
						code: formAT.inputCode.value,
						duree: time2mn( formAT.inputDuree.value ),
						couleur:formAT.inputColor.value
					},
					vueTbTypeAT
				  );
		},
		editElmt = function ( elmt ) {
			if( elmt == null ) {
				formAT.idTypeAt.value = '';
				formAT.inputColor.value = '#fff';
				formAT.inputLibelle.value = '';
				formAT.inputCode.value = '';
				formAT.inputDuree.value = '';
			} else {
				// Affichage de l'objet dans le form
				formAT.idTypeAt.value = elmt.IdTypeAt;
				formAT.inputColor.value = elmt.tpa_couleur;
				formAT.inputLibelle.value = elmt.tpa_libelle;

				formAT.inputDuree.value = sec2time(elmt.tpa_duree * 60, ':');
			}
			formAT.sauve.disabled = true;
			formAT.reset.disabled = true;
			
			formAT.querySelector('fieldset').style.opacity = 1.;
			
			formAT.inputLibelle.focus();
			
			return elmt != null;
		},
		editTypeAT = function ( e ) {
			var ident = e.target.parentNode.parentNode.dataset.ident, // reference l'identifiant de la ligne 'clickee'
				filtreModel = model.filter( function ( element ) {
					return (element.IdTypeAt == ident); 
				}),
				idValid = ( filtreModel.length == 1 );
			
			if(!idValid) {
				alert( 'Identifiant Invalide : ' + ident );
			} 
			
			return editElmt( idValid ? filtreModel[0] : null );
		},
		delUndelTypeAT = function ( e ) {
			var ident = e.target.parentNode.parentNode.dataset.ident; // reference l'identifiant de la ligne 'clickee'

			return $.post("./php/crudTypeAt.php", { cmd: 'delete', ident: ident }, vueTbTypeAT );
		},
		/**
		 * vueLigneAT() construction du node TR représentant l'item
		 *
		 * @param <Object> item : nb minute
		 * @return <node> trVue
		 */
		vueLigneAT = function ( item ) {
			var trVue = document.createElement("tr"),
				tdAttribut = document.createElement("td"),
				btn = document.createElement("button"),
				btnSuprimer = document.createElement("button");
			
			trVue.dataset.ident = item.IdTypeAt;
			
			tdAttribut.textContent = item.IdTypeAt;
			tdAttribut.style.backgroundColor = item.tpa_couleur;
			trVue.appendChild(tdAttribut);
			
			// Champ libellé
			tdAttribut = document.createElement("td");
			tdAttribut.textContent = item.tpa_libelle;
			trVue.appendChild(tdAttribut);
			// Champ code
			tdAttribut = document.createElement("td");
			tdAttribut.textContent = item.tpa_code;
			trVue.appendChild(tdAttribut);

			// Champ durée
			tdAttribut = document.createElement("td");
			tdAttribut.textContent = sec2time(item.tpa_duree * 60, 'h');
			trVue.appendChild(tdAttribut);

			tdAttribut = document.createElement("td");
			tdAttribut.appendChild(btn);
			if( 0 < +item.tpa_valid ) {
				btn.classList.add('editer');
				btn.addEventListener('click', editTypeAT);
				trVue.appendChild(tdAttribut);
				
				tdAttribut = document.createElement("td");
				btnSuprimer.classList.add('supprimer');
				tdAttribut.appendChild(btnSuprimer);
				btnSuprimer.addEventListener('click', delUndelTypeAT);
			} else {
				tdAttribut.setAttribute("colspan", 2);
				trVue.classList.add( 'barre' );
				
				btn.classList.add('undelete');
				btn.addEventListener('click', delUndelTypeAT);
			}
			trVue.appendChild(tdAttribut);
			
			return trVue; 
		},
		/*
		 * Affichage des type AT  dans la table 
		 */
		vueTbTypeAT = function ( data ) {
			var vueBody = eltTable.getElementsByTagName('tbody')[0];
			
			vueBody.innerHTML = '';
			if( data.success ) {
				model = data.result;
				for( var i = model.length-1; i >= 0 ; i-- ) {
					vueBody.appendChild( vueLigneAT( model[i] ) );
				}
				lisTypeAT(ulTypeAT);
			} else {
				alert(data.error.reason);
			}
			return eltTable; 
		},
		// Construction de la case draggable dans le header
		liTypeAT = function ( item ) {
			var liItem = document.createElement("li"),
				divItem = liItem.appendChild(document.createElement("div"));
			
			liItem.appendChild( document.createTextNode(item.tpa_libelle) );
				
			divItem.dataset.id = item.IdTypeAt;
			divItem.setAttribute('draggable', true);
			divItem.style.background = item.tpa_couleur;
			
			if( +item.tpa_valid > 0 ) {
				divItem.addEventListener('dragstart', function (event) {
					// store the ID of the element, and collect it on the drop later on
					event.dataTransfer.setData('Text', this.dataset.id);
				});
			} else {
				liItem.style.display='none';
			}
			return liItem;
		},
		/* 
		 * Rempli la ul par des li, à partir du modèle
		 */
		lisTypeAT = function ( ulTypeAT ) {
			if( ulTypeAT != undefined ) {
				ulTypeAT.innerHTML = '';
				for( i = model.length-1; i >= 0 ; i-- ) {
					ulTypeAT.insertBefore( liTypeAT( model[i] ), ulTypeAT.firstChild );
				}
			}
		},
		tabTypeAt = function ( ) {
		
			return model.reduce(
				function(previousValue, currentValue, index, array){
					var code = currentValue.tpa_code || '';
					
					if( code.length && previousValue.indexOf(code) == -1 ) {
						previousValue.push( code );
					};
					return previousValue;
				}, []
			);
		},
		loadAT = function () {
			return $.post("./php/crudTypeAt.php", {}, vueTbTypeAT);
		},
		nouvAT = function () {
			return editElmt( null );
		};
	
	formAT.inputLibelle.addEventListener( 'click', pxUtil.selectOnClick );
	formAT.inputDuree.addEventListener( 'click', pxUtil.selectOnClick);
	formAT.addEventListener( 'input', function() { 
		formAT.sauve.disabled = false;
		formAT.reset.disabled = false;
		return; 
	});
	formAT.addEventListener( 'submit', submitTypeAT );
	
	eltTable.querySelector('tfoot th button').addEventListener( 'click', nouvAT );
	
	return {
		loadAT: loadAT,
		nouvAT: nouvAT,
		tabTypeAt: tabTypeAt
	}
})( document.getElementById("table-typeAT"), document.getElementById("ul-typeAT") );

gridAT.loadAT();

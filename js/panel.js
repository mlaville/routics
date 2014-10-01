/**
 * panel.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       13/12/2013
 * @version    0.10
 * @revision   $0$
 *
 * Fonction generique de création de fenetre et menu
 *
 * A faire : case de miniaturisation, plein ecran
 * 
 */
var winManager = (function (document) {

  return {
    domFenetre: function (unTitre, unContenu, param, keepContentOnClose) {
		var divFenetre = document.createElement("div"),
			divTitre = divFenetre.appendChild( document.createElement("div") ),
			divClose = document.createElement("div"),
//			divClose = document.createElement("button"),
			divContent = divFenetre.appendChild( document.createElement("div") );

		if( param != undefined ) {
			divFenetre.style.left = param.x;
			divFenetre.style.top = param.y;
			divFenetre.style.width = param.width;
			divFenetre.style.height = param.height;
		}
		divFenetre.className = "fenetre";
		divTitre.className = "titreFenetre";
		divClose.className = "closeFenetre";
		divContent.className = "contenuFenetre";
		
		divTitre.appendChild( document.createTextNode(unTitre) );
		divTitre.appendChild( divClose );
		divClose.addEventListener("click", function() {
		
				if( (keepContentOnClose || false) == true ) {
				} else {
					unContenu.style.display = 'none';
					divFenetre.parentNode.appendChild(unContenu);
				}
				return divFenetre.parentNode.removeChild(divFenetre);
				
			}, false
		);
		if(unContenu) {
			divContent.appendChild(unContenu);
		}
		
		$(divFenetre).draggable({ handle: '.titreFenetre' });
		
		divFenetre.style.position = 'fixed';

		return divFenetre;
    }
  };
}(window.document));

function domItemMenu(unTitre, nomMenu, action) {
	var item = document.createElement("li");
	var input = item.appendChild(document.createElement("input"));
	var label = item.appendChild(document.createElement("label"));
	
	input.setAttribute( 'type', 'radio' );
	input.setAttribute( 'name', nomMenu );
	input.setAttribute( 'id', nomMenu + '-' + unTitre );
	
	label.setAttribute( 'for', nomMenu + '-' + unTitre );
	label.appendChild( document.createTextNode(unTitre) );
	
	if( action !== undefined ) {
//		item.addEventListener('click', action);
		input.addEventListener('change', action);
	}

	return item;
}

function domMenu(unTitre) {
	var menu = document.createElement("menu");
	
	menu.appendChild( document.createElement("div") )
		.appendChild( document.createTextNode(unTitre) );

	$(menu).draggable({ handle: 'div' });

	return menu;
}
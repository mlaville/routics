/**
 * formAutoroute.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       15/10/2015
 * @version    0.1
 * @revision   $0$
 *
 * Traitement du fichier autoroute
 * 
 * @date revision   
 *
 * Appel  ajax:
 * - ./php/uploadCsv
 *
 * Note : les appels getVehicule et getTrailers sont parametrés par le dataset de document.body
 *
 * A Faire
 * - gèrer la progression de l'upload
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

 /*
function FileUpload(img, file) {
  var reader = new FileReader();  
  this.ctrl = createThrobber(img);
  var xhr = new XMLHttpRequest();
  this.xhr = xhr;
  
  var self = this;
  this.xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) {
          var percentage = Math.round((e.loaded * 100) / e.total);
          self.ctrl.update(percentage);
        }
      }, false);
  
  xhr.upload.addEventListener("load", function(e){
          self.ctrl.update(100);
          var canvas = self.ctrl.ctx.canvas;
          canvas.parentNode.removeChild(canvas);
      }, false);
  xhr.open("POST", "http://demos.hacks.mozilla.org/paul/demos/resources/webservices/devnull.php");
  xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
  reader.onload = function(evt) {
    xhr.sendAsBinary(evt.target.result);
  };
  reader.readAsBinaryString(file);
}*/

function sendFile(file) {
	var uri = "./php/uploadCsvAutoroute.php";
	var xhr = new XMLHttpRequest();
	var fd = new FormData();
	
	xhr.open("POST", uri, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Handle response.
			// A faire : beep ou autre signal OK
//			alert(xhr.responseText); // handle response.
		}
	};
	fd.append('fileAutoroute', file);
	// Initiate a multipart/form-data upload
	xhr.send(fd);
}

var ctrlFormAutoroute = (function ( formAutoroute, eltTable ) {
	var fileElement = formAutoroute.fileElement,
		eltTrHead = eltTable.querySelector('thead tr'),
		reader = new FileReader(),
		readCsv = function( ) {
			var tabLigne = reader.result.split('\n'),
				eltTBody = eltTable.querySelector('tbody'),
				fragTCorps = document.createDocumentFragment(),
				traiteLigne = function(item) {
					var tabChamps = item.split(';'),
						fragLigne = document.createDocumentFragment(),
						ligne = document.createElement('tr');
					/*
					 * Test le premier champ : 
					 *  s'il est non vide, il s'agit d'une ligne sous-total.
					 */
					if( tabChamps.shift().length > 0 ) {
						ligne.classList.add('sousTotal')
					};
//					[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach( function(id) { return ligne.insertCell(-1).textContent = tabChamps[id]; } );
					tabChamps.forEach( function(it) { 
						return fragLigne.appendChild( document.createElement('td') ).textContent = it;
					});
					
					return fragTCorps.appendChild(ligne).appendChild(fragLigne)
				},
				tabTitre;
			
			// Recupere la date sur la 1ere ligne
			eltTable.querySelector('caption').textContent = ( tabLigne.shift().split(';') )[0];
			
			// Recupere les titres sur la 2eme ligne
			tabTitre = tabLigne.shift().split(';');
			tabTitre.shift();
			eltTrHead.innerHTML = '';
			tabTitre.forEach( function(it) { return eltTrHead.insertCell(-1).textContent = it; } );

			eltTBody.innerHTML = '';
			// traite les lignes restantes
			tabLigne.forEach(traiteLigne);
			
			formAutoroute.fileSelect.disabled = false;
			
			return eltTBody.appendChild(fragTCorps);
		},
		handleFiles = function () {
			
			formAutoroute.fileSelect.disabled = true;
			sendFile( fileElement.files[0] );

			return reader.readAsText( fileElement.files[0] );
		};
		
	reader.addEventListener('load', readCsv);
	fileElement.addEventListener("change", handleFiles, false);
	formAutoroute.fileSelect.addEventListener("click", function(e) {
		
		e.preventDefault(); // prevent navigation to "#"
		
		return fileElement.click();
	}, false);
	
	return;

})( document.forms["uploadAutoroute"], document.getElementById('table-autoroute') );

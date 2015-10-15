/**
 * formOr.js
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
	var uri = "./php/uploadCsv.php";
	var xhr = new XMLHttpRequest();
	var fd = new FormData();
	
	xhr.open("POST", uri, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Handle response.
			alert(xhr.responseText); // handle response.
		}
	};
	fd.append('myFile', file);
	// Initiate a multipart/form-data upload
	xhr.send(fd);
}

var ctrlFormAutoroute = (function ( formAutoroute, eltTable ) {
	var fileElement = formAutoroute.fileElement,
		eltTBody = eltTable.querySelector('tbody'),
		eltTrHead = eltTable.querySelector('thead tr'),
		eltProgress = formAutoroute.querySelector('progress'),
		reader = new FileReader(),
		readCsv = function( ) {
			var tabLigne = reader.result.split('\n'),
				traiteLigne = function(item) {
					var tabChamps = item.split(';'),
						ligne = eltTBody.insertRow(-1);
						
					if( tabChamps.shift().length > 0 ) {
						ligne.classList.add('sousTotal')
					};
//					[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach( function(id) { return ligne.insertCell(-1).textContent = tabChamps[id]; } );
					tabChamps.forEach( function(it) { return ligne.insertCell(-1).textContent = it; } );
					
					eltProgress.value = eltProgress.value + 1;
				},
//				ligneDate = tabLigne.shift(), // 
//				ligneEntete = tabLigne.shift(),
				tabTitre;
			
			// Recupere la date sur la 1ere ligne
			eltTable.querySelector('caption').textContent = ( tabLigne.shift().split(';') )[0];
			
			// Recupere les titres sur la 2eme ligne
			tabTitre = tabLigne.shift().split(';');
			tabTitre.shift();
			tabTitre.forEach( function(it) { return eltTrHead.insertCell(-1).textContent = it; } );
			
			eltProgress.value = 0;
			eltProgress.max = tabTitre.length;
			
			eltTBody.innerHTML = '';
			// traite les lignes restantes
			tabLigne.forEach(traiteLigne);
			
			return formAutoroute.fileSelect.disabled = false;
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

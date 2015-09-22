/**
 * pdfRecapMensuel.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013-14
 * @date       06-05-2014
 * @version    0.1
 * @revision   $0$
 *
 *
 * Génère le pdf du plannig
 * 
 * Ajax : 
 * aucun appel
 *
 * A Faire
 * - Extraire les données personnalisées
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
function pdfRecapMensuel( uneTable ) {
	// You'll need to make your image into a Data URL
	// Use http://dataurl.net/#dataurlmaker
	var imgData = document.getElementById('dataUrl').value,

		imgWt = 'data:image/jpeg;base64,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',

		imgPolinux = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAPAEMDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAAYC/8QAKRAAAgICAQQCAQMFAAAAAAAAAQIDBAUREgAGITETIgcUI0EVFjJRgf/EABkBAQACAwAAAAAAAAAAAAAAAAEABQIDBP/EAB4RAAEDBQEBAAAAAAAAAAAAAAABAhEDEiExYQSR/9oADAMBAAIRAxEAPwDp8VIZO6qGDhxWPmrDCQ2BDBiKj2JpBjln4h3hclnceyGP26co5PBZUZCDFYuJpqdKzYeU46i8Y+KOVlcD9CpMRKRAljG25QAp1vqPTt9vnOVMvL3FjfhbDxUZ6ri1HKpNAVpByWu6gg8iCOQOh1QF7seAWZaGQxsFqxXniaRrFgqWljmj58Vx68QBMRwQop4JsbG+rJHULU1MJ9MMnrtqxPlsFiQmN7d/XXstNTEj4WoF0Fr8AdReADIx2Bvz/Oh09ZpXq2TnpWa3bEKV4RPNPJgoFWNCwUFkMHyAlmUaKb+wbXE8uo2DuYTF4THV4O9MQl2lkZriSCtbKjksATW4PJBiJII169+etj72HoTGWt3nhQWXg6yU7UiOuwdMjVyrDYB8g+QD7A6q/Vmq6zXBSR3Jf1DHw/JbxfbqMLU1RoxhqZZZIgnPeota+40QT6P/AGocFnjBfsJiu25IKFizXsyJhapCNBGXYn9nemAIU/70DrY3Eky+OloS0Zu9sLNFLM07tLSsvJ8jceTCQ1y4J4LvR8689FPcMBew39/4sGy1hpuNW0BIZwBLsCv5DcV8egQCNHrRD+iMTRXIIjNPV7YjiVqodzhaxCixEZUJAhJ0FU70Cd+gelslLbx/xrZx/bYlfZ+JMPTchfHFyREV03tdHyNN/iykjfL454a8Mne2FeOuysqvSstyKjSc91/3Ao+oD7ABIGgddBuX8VcRFt98YucozsHkguM+2PJvsYNkE7OidbZj7Y7If0hy/wCSo4Y+7H+CvXrq9KnKUghWJAz1YmYhVAA2xJ8D+et0P8gXKV7ud58faS3XWrUhEyIyq7R14420HAbXJT7A63XSmhP/2Q==',
		
		doc = new jsPDF('l'),
		eltTr = uneTable.querySelector('thead tr'),
		listTr = uneTable.querySelectorAll('tbody tr'),
		nbLg = listTr.length,
		impair = true,
		h = 26,
		delta = 5,
		marge = 10,
		lgCol = 24,
		lgCol1 = 48,
		gauche = marge + lgCol1,
		dateEdition = new Date,
		strDateEdition = 'Edité le ' 
			+ Date.dayNames()[dateEdition.getDay()] + ' '
			+ dateEdition.getDate() + ' '
			+ Date.monthNames()[ dateEdition.getMonth() ] + ' '
			+ dateEdition.getFullYear() + ' à '
			+ dateEdition.getHours() + 'h' + dateEdition.getMinutes(),
		pageNum = 1,
		
		docHeader = function() {
			doc.setFont("helvetica");
			doc.setFontType("normal");
			doc.setFontSize(10);
			doc.text(8, 8, "+");
			
			doc.addImage(imgWt, 'JPEG', 4, 4, 9.6, 9.6);
			doc.addImage(imgData, 'JPEG', 260, 4, 25.5, 6.3);
			
			doc.setFontType("bold");
			doc.setFontSize(16);
			doc.text(72, 12, 'Récapitulatif Mensuel d\'Activité Conducteur');
			
			return;
		},
		docFooter = function(  ) {

			doc.setFontSize(8);
			doc.setFont("times");
			doc.setFontType("italic");
			doc.text( 120, 200, 'page ' + pageNum );
			doc.text( 220, 200, strDateEdition );
			doc.addImage( imgPolinux, 'JPEG', 4, 200, 13.4, 3 );
		}
		tableHeader = function( unEltTr ) {
			
			var cellEntete = function( arrLib ) {
				doc.setFillColor(150,150,255);
				doc.rect(gauche, h - delta, lgCol, 12, 'FD'); // filled square with red borders
				doc.text(gauche + 2, h, arrLib[0]);
				doc.text(gauche + 2, 5 + h, arrLib[1]);
				gauche += lgCol;
			};
			
			doc.setFont("helvetica");
			doc.setFontType("bold");
			doc.setFontSize(12);
			doc.setFillColor(150,150,255);
			doc.rect(marge, h - delta, lgCol1, 12, 'FD'); // filled square with red borders
			doc.text(marge + 1, h, unEltTr.firstElementChild.firstElementChild.textContent); // libellé du mois
			
			gauche = marge + lgCol1;

			[ ["conduite", "disque"],
			  ["TA", "disque"],
			  ["Total", "disque"],
			  ["TA", "réel"],
			  ["Total", "réel"],
			  ["%", "Conduite"],
			  ["Modif", "disque"],
			  ["%", "Conduite"] ].forEach(cellEntete);

			doc.rect(gauche, h - delta, lgCol / 2, 12); // filled square with red borders
			doc.text(gauche + 2, 5 + h, "-");
			
			h += 6;
			
			return;
		},
		tableRow = function( unElmtTr ) {
			var  arrayBgColor = unElmtTr.style.backgroundColor.arrayRGB(),
				arrayColor = [ 6, 6, 6 ],
				val,
				listCell = unElmtTr.querySelectorAll('td'),
				tableCellNumber = function( unNumber ) {
					doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
					doc.rect(gauche, h - delta, lgCol, 6, 'FD');
					doc.text( gauche + 2, h, ('     ' + unNumber).slice(-8) );
					gauche += lgCol;
				};
				
			h += 6;
			// Test le changement de page
			if( h > 186 ) {
				docFooter( );
				doc.addPage();
				pageNum++;
				docHeader( );
				h = 26;
				tableHeader( uneTable.querySelector('thead tr') );
				h += 6;
			}
			
			if(listCell[0].style.color) {
				arrayColor = listCell[0].style.color.arrayRGB().map(function(i) { return +i; });
				doc.setDrawColor( arrayColor[0], arrayColor[1], arrayColor[2] );
			} else {
				doc.setDrawColor(6, 6, 6);
			}
			
			if(arrayBgColor) {
				arrayBgColor = arrayBgColor.map(function(i) { return +i; });
			} else {
				arrayBgColor = impair ? [ 255, 255, 255 ] : [ 230,230,230 ];
			}
			
			/**
			 * Dessine chaque cellule de la ligne 
			 */
			// Cellule Conducteur
			doc.setFont("helvetica");
			doc.setFontSize(10);
			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect( marge, h - delta, lgCol1, 6, 'FD' ); 
			doc.text( marge+1, h, listCell[0].firstElementChild.textContent.capitalize() );

			doc.setFont("courier");
			doc.setFontSize(12);
			gauche = marge + lgCol1;
			
			[ 1, 2, 3, 4, 5 ].forEach( function(item) {
				return tableCellNumber(new Number(listCell[item].firstElementChild.value).toFixed(2));
			});

			tableCellNumber( listCell[6].firstElementChild.value );
			
			val = listCell[7].firstElementChild.value;
			tableCellNumber( (val.length ) ? new Number(val).toFixed(2) : '');
			
			tableCellNumber( listCell[8].firstElementChild.value );

			doc.setFillColor( arrayBgColor[0], arrayBgColor[1], arrayBgColor[2] );
			doc.rect(gauche, h - delta, lgCol/2, 6, 'FD');
			doc.text( gauche + 1, h, ('    ' + listCell[9].textContent).slice(-4) );
			/* Fin de ligne */
			impair = !impair;
		};
	
	docHeader( );
	tableHeader( uneTable.querySelector('thead tr') );

	for( var ligne = 0 ; ligne < nbLg ; ligne++ ) {
		var eltTr = listTr[ligne];

		if( eltTr.style.display != 'none' ) {
			tableRow(eltTr);
		}
	}
	docFooter( );

	return doc.output('datauristring');
}

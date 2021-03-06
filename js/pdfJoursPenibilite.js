/**
 * pdfJoursPenibilite.js
 * 
 * @auteur     marc laville
 * @Copyleft 2016
 * @date       16/02/2016
 * @version    0.1
 * @revision   $0$
 *
 * @date revision   23/03/2016 Finalisation  
 *
 * Génère le pdf des heures de nuit
 * 
 * Ajax : 
 * aucun appel
 *
 * A Faire
 * - Extraire les données personnalisées
 * - Numérotation des pages
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 
'use strict';

function pdfJoursPenibilite( modele, tabMois ) {
	// You'll need to make your image into a Data URL
	// Use http://dataurl.net/#dataurlmaker
	var imgData = "data:image/jpeg;base64,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",
		imgTm = 'data:image/png;base64,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',
		imgPolinux = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAPAEMDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAAYC/8QAKRAAAgICAQQCAQMFAAAAAAAAAQIDBAUREgAGITETIgcUI0EVFjJRgf/EABkBAQACAwAAAAAAAAAAAAAAAAEABQIDBP/EAB4RAAEDBQEBAAAAAAAAAAAAAAABAhEDEiExYQSR/9oADAMBAAIRAxEAPwDp8VIZO6qGDhxWPmrDCQ2BDBiKj2JpBjln4h3hclnceyGP26co5PBZUZCDFYuJpqdKzYeU46i8Y+KOVlcD9CpMRKRAljG25QAp1vqPTt9vnOVMvL3FjfhbDxUZ6ri1HKpNAVpByWu6gg8iCOQOh1QF7seAWZaGQxsFqxXniaRrFgqWljmj58Vx68QBMRwQop4JsbG+rJHULU1MJ9MMnrtqxPlsFiQmN7d/XXstNTEj4WoF0Fr8AdReADIx2Bvz/Oh09ZpXq2TnpWa3bEKV4RPNPJgoFWNCwUFkMHyAlmUaKb+wbXE8uo2DuYTF4THV4O9MQl2lkZriSCtbKjksATW4PJBiJII169+etj72HoTGWt3nhQWXg6yU7UiOuwdMjVyrDYB8g+QD7A6q/Vmq6zXBSR3Jf1DHw/JbxfbqMLU1RoxhqZZZIgnPeota+40QT6P/AGocFnjBfsJiu25IKFizXsyJhapCNBGXYn9nemAIU/70DrY3Eky+OloS0Zu9sLNFLM07tLSsvJ8jceTCQ1y4J4LvR8689FPcMBew39/4sGy1hpuNW0BIZwBLsCv5DcV8egQCNHrRD+iMTRXIIjNPV7YjiVqodzhaxCixEZUJAhJ0FU70Cd+gelslLbx/xrZx/bYlfZ+JMPTchfHFyREV03tdHyNN/iykjfL454a8Mne2FeOuysqvSstyKjSc91/3Ao+oD7ABIGgddBuX8VcRFt98YucozsHkguM+2PJvsYNkE7OidbZj7Y7If0hy/wCSo4Y+7H+CvXrq9KnKUghWJAz1YmYhVAA2xJ8D+et0P8gXKV7ud58faS3XWrUhEyIyq7R14420HAbXJT7A63XSmhP/2Q==',
		
		doc = new jsPDF('p'), // orientation "portrait"
		impair = true,
		h = 26,
		delta = 4,
		marge = 10,
		lgCol = 11,
		lgCol1 = 44,
		gauche = marge + lgCol1,
		dateEdition = new Date,
		strMois = 'Edité le ' 
			+ dateEdition.toLocaleString( 'fr', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'} )
			+ ' à ' + dateEdition.getHours() + 'h' + dateEdition.getMinutes(),
		
		docHeader = function(  ) {
			doc.setFont("helvetica");
			doc.setFontType("normal");
			doc.setFontSize(10);
			doc.text(8, 8, "+");
			
			doc.addImage(imgTm, 'JPEG', 4, 4, 9.6, 9.6);
			doc.addImage(imgData, 'JPEG', 172, 4, 30.6, 7.56);
			
			doc.setFontType("bold");
			doc.setFontSize(16);
			doc.text(72, 12, 'Pénibilité - Travail de nuit');
			doc.setFontType("normal");
			doc.setFontSize(8);
			doc.text(72, 16, 'Récapitulatif des départs avant 4H');
			
			return;
		},
		docFooter = function( ) {

			doc.setFontSize(8);
			doc.setFont("times");
			doc.setFontType("italic");
			doc.text( 130, 286, strMois );
			doc.addImage( imgPolinux, 'JPEG', 4, 286, 13.4, 3 );
			
			return;
		},
		tabLibelleMois = Date.monthNames('fr', { month: "short" }),
		tableHeader = function( ) {
		
			doc.setFontType('bold');
			doc.setFontSize(10);
			doc.setFillColor(150,150,255);
			doc.rect(marge, h - delta, lgCol1, 12, 'FD');
			doc.text(marge + 1, h, "Chauffeur");
			
			gauche = marge + lgCol1;
			
			tabMois.forEach(function(item) {
				var arr = item.toIntArray();
				
				doc.setFillColor(150,150,255);
				doc.rect(gauche, h - delta, lgCol, 12, 'FD');
				doc.text(gauche + 1, h, tabLibelleMois[ arr[1] - 1 ].capitalize());
				doc.text(gauche + 1, h+4, '' + arr[0]);
				gauche += lgCol;
				return;
			});
			
			doc.setFillColor(150,150,255);
			doc.rect(gauche, h - delta, lgCol, 12, 'FD');
			doc.text(gauche + 2, h, "Total");
			
			h += 6;
			
			return;
		},
		ligneConducteur = function( itemConduct, bgColor ) {
			var	totConduct = 0,
				hauteur = 6;
			
			// Cellule Conducteur
			doc.setDrawColor(0,0,0);
			doc.setFont("helvetica");
			doc.setFontSize(10);
			doc.setFillColor( bgColor[0], bgColor[1], bgColor[2] );
			doc.rect( marge, h - delta, lgCol1, 12, 'FD' ); 
			doc.text( marge+1, h, itemConduct.FormattedName.capitalize() ); // nom
			
			gauche = marge + lgCol1;
			
			doc.setFont("courier");
			tabMois.forEach(function(itemMois) {
				doc.setFillColor( bgColor[0], bgColor[1], bgColor[2] );
				doc.rect(gauche, h - delta, lgCol, 12, 'FD');
				if(itemConduct.hrNuit != undefined) {
					if( itemConduct.hrNuit[itemMois] != undefined) {
						doc.text(gauche + 2, h, itemConduct.hrNuit[itemMois].nbJours.lpad( ' ', 3) );
						totConduct += +itemConduct.hrNuit[itemMois].nbJours;
					}
				}
				gauche += lgCol;
				
				return;
			});
			
			doc.setFillColor( bgColor[0], bgColor[1], bgColor[2] );
			doc.rect(gauche, h - delta, lgCol, 12, 'FD');
			doc.text(gauche + 2, h, ('' + totConduct).lpad( ' ', 3) );
			
			return hauteur;
		},
		ligne;
		
	docHeader( );
	tableHeader(  );
	h += 6;

	for( ligne = 0 ; ligne < modele.length ; ligne++ ) {

		// Test le changement de page
		if( h > 266 ) {
			docFooter( );
			doc.addPage();
			docHeader( );
			h = 26;
			tableHeader();
			h += 6;
		}
			
		h += ligneConducteur( modele[ligne], impair ? [ 255, 255, 255 ] : [ 230, 230, 230 ], h );
		impair = !impair;
	}
	docFooter( );

	return doc.output('datauristring');
}

<?php
/**
 * File name   : pdfStatVehicle.php
* Begin       : 2013-06-01
* Last Update : 2013-06-01
*
* Basé sur : Example 048 for TCPDF class de Nicola Asuni
*               HTML tables and table headers
* http://www.tcpdf.org/examples/example_048.phps
*
* Author: Marc Laville
*
* (c) Copyleft:
*              Marc Laville
*               polinux
*               www.polinux.net
*               marc.laville@polinux.net
*/
error_reporting(E_ERROR);

include 'connect.inc.php';
include 'funcStatVehicles.php';

// Include the main TCPDF library (search for installation path).
require_once('./tcpdf/tcpdf.php');

// Extend the TCPDF class to create custom Header and Footer
class PolinuxPDF extends TCPDF {

	//Page header
	public function Header() {
		// Logo
		$repImage = "../img/";
		$image_file = $repImage.'dossierOr.jpg';
		$image_file2 = $repImage.'pbqd2.jpg';
		$this->Image($image_file, 10, 8, 15, '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);
		// Set font
		$this->SetFont('helvetica', 'B', 12);
		// Title
		$this->Cell(0, 15, 'OR - Statistiques', 0, false, 'C', 0, '', 0, false, 'M', 'M');
		$this->Image($image_file2, 172, 10, 30, '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);
	}

	// Page footer
	public function Footer() {
		$repImage = "../img/";
		$image_file = $repImage.'polinux-micro.gif';
		$this->Image($image_file, 10, 285, 15, '', 'GIF', '', 'T', false, 300, '', false, false, 0, false, false, false);
		// Position at 12 mm from bottom
		$this->SetY(-12);
		// Set font
		$this->SetFont('helvetica', 'I', 8);
		// Page number
		$this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
	}
}

// create new PDF document
$pdf = new PolinuxPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Marc Laville - polinux');
$pdf->SetTitle('Edition des Statistiques');
$pdf->SetSubject('Statistiques');
$pdf->SetKeywords('statistiques, or, ordre de réparation, polinux');

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 048', PDF_HEADER_STRING);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER+12);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}

// ---------------------------------------------------------
$param = array(
	"dateInf" => isset($_GET["dateInf"] ) ? $_GET["dateInf"] : '01/04/2013',
	"dateSup" => isset($_GET["dateSup"] ) ? $_GET["dateSup"] : '30/04/2013',
	"typeVehicule" => isset($_GET["typeVehicule"] ) ? $_GET["typeVehicule"] : '',
	"typeEdit" => isset($_GET["typeEdit"] ) ? $_GET["typeEdit"] : ''
);
// set font
$pdf->SetFont('helvetica', 'B', 16);

// add a page
$pdf->AddPage();

$pdf->Write(0, 'Statistique des Coûts Kilométriques', '', 0, 'L', true, 0, false, false, 0);
//$pdf->Write(0, 'du ' .  .' au ' . '30/04/2013', '', 0, 'L', true, 0, false, false, 0);
$pdf->Write(0, 'du ' . $param["dateInf"] .' au ' . $param["dateSup"], '', 0, 'L', true, 0, false, false, 0);

$pdf->SetFont('helvetica', '', 8);

// -----------------------------------------------------------------------------

$tbl = <<<EOD
<style>
body {
font-family: Arial;
}
th {
	border: 1px solid silver;
	text-align: center;
	font-weight: bold;
	font-size: 1.1em;
}
td {
	border: 1px solid silver;
	padding: 2px 8px 2px 8px;
	text-align:center;
}
.sousTotal {
	font-weight: bold;
	border-bottom-style: solid;
	background-color: #A0AEB6;
	height: 64px;
}
.nombre {
text-align: right;
}

.immat {
	text-align:center;
	font-size: 0.9em;
	background-color: #ebfdfe;
	font-family: Arial Narrow;
	font-weight: bold;
	border-left: none;
}
</style>
<table cellspacing="0" cellpadding="1" border="1">
<thead>
<tr class="masque">
	<th colspan="2">Parc</th>
	<th colspan="2">Km Parcourus<br />pendant la période</th>
	<th>Nb OR</th>
	<th colspan="2">Coût Total</th>
	<th>Coût KM</th>
</tr>
</thead>
<tbody>
EOD;

$response = statVehicle($dbFlotte, $param);
foreach($response["result"] as $lg){
	if( $lg["VehicleID"] != null ) {
		if( $param["typeEdit"] == 'detail' ) {
			$tbl .= '<tr class="masque">';
			$tbl .= '<td>' . $lg["VehicleID"] . '</td>';
			$tbl .= '<td class="immat">' . $lg["LicensePlate"] . '</td>';
			$tbl .= '<td class="td-km nombre">' . $lg["Kms"] . '</td><td></td>';
			$tbl .= '<td class="nombre">' . $lg["NbOr"] . '</td>';
			$tbl .= '<td class="nombre td-euro" colspan="2">' . $lg["TotCout"] . '</td>';
			$tbl .= '<td class="nombre">' . $lg["CoutKm"] . '</td>';
			$tbl .= '</tr>';
		}
	} else {
		$tbl .= '<tr class="sousTotal">';
		$tbl .= '<td colspan="2">' . $lg["NbVehicule"] . ' - ' . ( ( $lg["Rupture"] == null ) ? 'Véhicules' : $lg["Rupture"] ) . '</td>';
		$tbl .= '<td class="td-km nombre">' . $lg["Kms"] . '</td><td></td>';
		$tbl .= '<td class="nombre">' . $lg["NbOr"] . '</td>';
		$tbl .= '<td class="nombre td-euro" colspan="2">' . $lg["TotCout"] . '</td>';
		$tbl .= '<td class="nombre">' . $lg["CoutKm"] . '</td>';
		$tbl .= '</tr>';

	}
}

$tbl .= <<<EOD
</tbody>
</table>
EOD;

$pdf->writeHTML($tbl, true, false, false, false, '');

// -----------------------------------------------------------------------------

//Close and output PDF document
$pdf->Output('Statistique.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+

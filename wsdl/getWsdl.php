<?php
file_put_contents( './transics.wsdl', file_get_contents('http://transics.tx-connect.com/IWSLead/Service.asmx?WSDL') );
?>
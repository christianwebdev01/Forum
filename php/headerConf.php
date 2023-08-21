<?php
#Indica pro cliente que eu posso receber esses parametros no header (valores: localhost, AJAX, json e json)
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

#Permite compartilhamento de recursos somente da origem localhost:3000
header("Access-Control-Allow-Origin: http://localhost:3000");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

//Compartilhar sessões com servidor
header('Access-Control-Allow-Credentials: true');

//Tipo de conteúdo a enviar
header('Content-Type: application/json');
?>
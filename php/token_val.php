<?php
session_start();
$sigv = $_SESSION['sigv'];

function validation($token,$expiration){
global $sigv;
//Compara o unix-timestamp gerado pela react na hora do login com o atual gerado pelo php
if($token === $sigv && $expiration > time()){
    return 1;
}else{
    return 0;
}

}

?>
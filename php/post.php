<?php #PHP para quando é feito um post
require_once('headerConf.php');
session_start();

$input = json_decode(file_get_contents('php://input'), true);
$form = $input['dados'];
//dados formulário
$comunidade = $form['comunidade'];
$texto = $form['texto'];
$title = $form['title'];
$img = $form['imagem'];

$data = $form['data'];
$tempo = $form['tempo'];

//Corta meta dados da imagem em base64
$img = substr($img, strpos($img, ',') + 1);

$img_decode = base64_decode($img);

$dado = json_decode($input['tokenJWT'], true);
$exp = $dado['expiration'];
$jwt = $dado['token'][2];
$sigv = $_SESSION['sigv'];

if($jwt === $sigv){
    //Compara o unix-timestamp gerado pela react na hora do login com o atual gerado pelo php
    if($exp > time()){
        $valido = 1;
        
    } else{
        $valido = 0;
    }
} else {
    $valido = 0;
}

//Inserção no BD
if($valido){
    require_once('pdo.php');
    $sql = "INSERT INTO postagens (imagem,title,texto,usuarios_id,comunidade,`data`,tempo) VALUES (:img,:title,:txt,:id,:r,:dt,:tp)";
    $prep = $pdo->prepare($sql);
    $prep->execute(array(
        ":img" => $img_decode,
        ":title" => $title,
        ":txt" => $texto,
        ":id" => $_SESSION['usuarios_id'],
        ":r" => $comunidade,
        ':dt' => $data,
        ':tp' => $tempo
    ));
echo json_encode(['msg' => 'Successo']);
} else{
    $retorno = "Erro";
}
?>

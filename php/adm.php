<?php #Proposito de enviar mensagens a usuários no BD
require_once('headerConf.php');
session_start();

$input = json_decode(file_get_contents("php://input"), true );
$texto = $input['texto'];
$id = $input['id'];

require_once('pdo.php');
$post = $pdo->prepare("INSERT INTO notifications (all_users,texto,usuarios_id,por) VALUES (:all,:t,:id,:por)");

$post->execute(array(
    //All = para todos os usuários - modificar depois
    ":all" => 0,
    ":t" => $texto,
    "id" => $id,
    ":por" => 'Sistema'
));
echo json_encode(["msg" => "sent"]);
?>
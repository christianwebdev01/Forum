<?php #Proposito desse php é servir como leitura de postagens de uma certa comunidade
require_once('headerConf.php');
session_start();

//Exigir somente comunidade
$post = json_decode(file_get_contents('php://input'), true);

$comunidade = $post['comunidade'];



if(isset($comunidade)){
    require_once('pdo.php');

    $query = $pdo->prepare("SELECT postagens.imagem,postagens.usuarios_id, postagens.texto, postagens.tempo,postagens.data, postagens.title,postagens.postagens_id, usuarios.username
    FROM postagens JOIN usuarios ON usuarios.usuarios_id = postagens.usuarios_id
    WHERE postagens.comunidade = :co");

    $query->execute(array(
        ":co" =>  $comunidade
    ));
    $posts = $query->fetchAll(PDO::FETCH_ASSOC);

    //Cada linha do fetch retornado terá sua coluna foto codificada em base64
    foreach($posts as &$item ){
        $item['imagem'] = base64_encode($item['imagem']);
    }

    echo json_encode(['POSTAGENS'=>$posts]);
}
?>
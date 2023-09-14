<?php #Proposito desse php é servir como leitura de postagens de uma certa comunidade
require_once('headerConf.php');
session_start();

if(isset($_GET['aberto'])){
   
    $id = $_GET['aberto'];
    require_once('pdo.php');
    $sql_data = "SELECT data,tempo,comunidade FROM postagens WHERE postagens_id = $id";
    $linha1 = $pdo->prepare($sql_data);
    $linha1->execute();
    $resultado1 = $linha1->fetch(PDO::FETCH_ASSOC);

    $sql_comment = "SELECT comentarios.texto,usuarios.username,comentarios.comentarios_id FROM comentarios LEFT JOIN usuarios ON comentarios.usuarios_id = usuarios.usuarios_id WHERE comentarios.postagens_id = $id";    
    $linha_comment = $pdo->prepare($sql_comment);
    $linha_comment->execute();
    $comentarios = $linha_comment->fetchAll(PDO::FETCH_ASSOC);
  
    $sql_replies = "SELECT comentarios.texto,usuarios.username,comentarios.second_comment_id FROM comentarios LEFT JOIN usuarios ON usuarios.usuarios_id = comentarios.usuarios_id WHERE second_comment_id != 'null'";
    $linha_rep = $pdo->prepare($sql_replies);
    $linha_rep->execute();
    $replies = $linha_rep->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['data_e_tempo' => $resultado1, 'comentarios' => $comentarios, 'replies'=>$replies]);
    exit();
}

//Exigir somente comunidade
$post = json_decode(file_get_contents('php://input'), true);

if(isset($_GET['comentar']) && $_SERVER['REQUEST_METHOD'] === 'POST'){
    require_once('pdo.php');
    $comentario = $post['dado'];

    if($_SESSION['usuarios_id'] !== null){
        $sql_comentar = "INSERT INTO comentarios (usuarios_id,texto,postagens_id) values (:userId,:texto,:postId)";
        $linha_post = $pdo->prepare($sql_comentar);
        $linha_post->execute([
            ':userId' => $_SESSION['usuarios_id'],
            ':texto' => $comentario,
            ':postId' => $_GET['comentar']
        ]);
    } else{
        $sql_comentar = "INSERT INTO comentarios (texto,postagens_id) values (:texto,:postId)";
        $linha_post = $pdo->prepare($sql_comentar);
        $linha_post->execute([
            ':texto' => $comentario,
            ':postId' => $_GET['comentar']
        ]);
    }

    //echo json_encode(['hi'=>$_SESSION['usuarios_id'] === null]); true

    echo json_encode(['hi'=>'yes baby']);
    
    //echo json_encode(['hi'=>$_SESSION['usuarios_id']]);//null = anon
    //echo json_encode(['hi'=>$_GET['comentar']]); id do post

    exit();

}

if(isset($post['comunidade'])){
    $comunidade = $post['comunidade'];
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
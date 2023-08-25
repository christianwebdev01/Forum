<?php
//construir modularidade em queries--

require_once('headerConf.php');
session_start();
require_once('pdo.php');

$usuarios_id = $_SESSION['usuarios_id'];

//enviar soma de upvotes para cada post
if(isset($_GET['upvotes_total'])){

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $dados = json_decode(file_get_contents('php://input'),true);
        $postagens_id = $dados['dado'];

    //pegando linha onde possui o id do usuario pra conferir voto feito
    $consulta1= $pdo->prepare("SELECT valor FROM upvotes WHERE postagens_id=:post AND usuarios_id = :user");
    $consulta1->execute(array(
    ':post' => $postagens_id,
    ':user' => $usuarios_id
));
$resultado1 = $consulta1->fetch(PDO::FETCH_ASSOC);
    //pegar total de upvotes de um post
    $sql = "SELECT valor FROM upvotes WHERE postagens_id = :id";
    $linha = $pdo->prepare($sql);
    $linha->execute(array(
        ':id' => $postagens_id
    ));
    $total_upvotes = $linha->fetchAll(PDO::FETCH_ASSOC);
    
    $soma = [];
    $total = 0;

    foreach($total_upvotes as $valor){
        $soma[] = $valor['valor'];
    }
    foreach($soma as $valor){
        $total = $total + $valor;
    }
    
    echo json_encode(['msg' => $total, 'rel' => $resultado1]);
    exit();
    }
}

$dados = json_decode(file_get_contents('php://input'),true);
$par_de_voto = $dados['voto'];

$dado = json_decode($dados['tokenJWT'], true);
$exp = $dado['expiration'];
$jwt = $dado['token'][2];
$sigv = $_SESSION['sigv'];

require_once('token_val.php');
$valido = validation($jwt,$exp);

if(isset($dados)){

if($valido){
    foreach($par_de_voto as $post => $voto){
        // id do post
        //valor do voto
        
       #qual valor de voto o usuario tem no post no Banco de dados
       $sql = "SELECT valor FROM upvotes WHERE usuarios_id = :user AND postagens_id = :post";
       $query_voto = $pdo->prepare($sql);
       $query_voto->execute(array(
           ':user' => $usuarios_id,
           ':post' => $post
       ));
       $valor_do_upvote_na_postagem = $query_voto->fetch(PDO::FETCH_ASSOC);
           
       require_once('inserir_upvotes.php');
       
           //para posts

           if($voto === 1){
               //fazer insert caso o user não tenha interagido com o post
               if(!$valor_do_upvote_na_postagem){
                $msg = insert_DB(1,$usuarios_id,$post);
               } 
               //Atualizo a linha da tabela caso seja existente
               else{
                $msg = update_DB(1,$usuarios_id,$post);
               }
               //Para neutros
       } else if($voto === 0){
           if(!$valor_do_upvote_na_postagem){
            $msg = insert_DB(0,$usuarios_id,$post);
           } else{
            $msg = update_DB(0,$usuarios_id,$post);
           }
       }
       //para downvotes
       else if($voto === -1){
           if(!$valor_do_upvote_na_postagem){
            $msg = insert_DB(-1,$usuarios_id,$post);
           } else{
            $msg = update_DB(-1,$usuarios_id,$post);
           }
       }else{
           $msg='Erro: Postagem inexistente ou não logado';
       }
       }
    echo json_encode(['msg' => $msg]);
}else{
    echo json_encode(['erro' => 'Por favor, esteja logado para interagir com as postagens']);
}
}else{
    echo json_encode(['erro' => 'Dados não enviados corretamente']);
}

?>
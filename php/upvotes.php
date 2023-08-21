<?php
//a implementar validação token--
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
    
    //[0 => [valor => -1], 2 => [valor => 1]
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


//{29:-1,30:1}
//[29 => -1, 30 => 1]
//pegando id da postagem e valor do voto

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
       
           
           //para posts
           if($voto === 1){
       
               //fazer insert caso o user não tenha interagido com o post
               if($valor_do_upvote_na_postagem === false){
                   $sql_insert = "INSERT INTO upvotes (valor,postagens_id,usuarios_id) VALUES (:val,:post,:user)";
                   $linha = $pdo->prepare($sql_insert);
                   $linha->execute(array(
                       ':val' => 1,
                      ':post' => $post,
                      ':user' => $usuarios_id
                   ));
                   $msg = 'inserido';
               } 
               //Atualizo a linha da tabela caso seja existente
               else{
                   $sql_update = "UPDATE upvotes SET valor = :val WHERE usuarios_id = :user AND postagens_id = :post";
                   $linha = $pdo->prepare($sql_update);
                   $linha->execute(array(
                       ':val' => 1,
                       ':user' => $usuarios_id,
                       ':post' => $post
                   ));
                   $msg = 'atualizado';
               }
               //Para neutros
       } else if($voto === 0){
           if($valor_do_upvote_na_postagem === false){
       
               $sql_insert = "INSERT INTO upvotes (valor,postagens_id,usuarios_id) VALUES (:val,:post,:user)";
               $linha = $pdo->prepare($sql_insert);
               $linha->execute(array(
                   ':val' => 0,
                  ':post' => $post,
                  ':user' => $usuarios_id
               ));
               $msg = 'inserido';
           } else{
               $sql_update = "UPDATE upvotes SET valor = :val WHERE usuarios_id = :user AND postagens_id = :post";
               $linha = $pdo->prepare($sql_update);
               $linha->execute(array(
                   ':val' => 0,
                   ':user' => $usuarios_id,
                   ':post' => $post
               ));
               $msg = 'atualizado';
       
           }
       }
       //para downvotes
       else if($voto === -1){
           if($valor_do_upvote_na_postagem === false){
               
               $sql_insert = "INSERT INTO upvotes (valor,postagens_id,usuarios_id) VALUES (:val,:post,:user)";
               $linha = $pdo->prepare($sql_insert);
               $linha->execute(array(
                   ':val' => -1,
                  ':post' => $post,
                  ':user' => $usuarios_id
               ));
               $msg = 'inserido';
           } else{
               $sql_update = "UPDATE upvotes SET valor = :val WHERE usuarios_id = :user AND postagens_id = :post";
               $linha = $pdo->prepare($sql_update);
               $linha->execute(array(
                   ':val' => -1,
                   ':user' => $usuarios_id,
                   ':post' => $post
               ));      
               $msg = 'atualizado'; 
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
    exit();
}

?>
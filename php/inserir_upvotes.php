<?php
require_once('pdo.php');
function insert_DB($val,$user,$post){
    global $pdo;
    $sql_insert = "INSERT INTO upvotes (valor,postagens_id,usuarios_id) VALUES (:val,:post,:user)";
    $linha = $pdo->prepare($sql_insert);
    $linha->execute(array(
        ':val' => $val,
        ':user' => $user,
        ':post' => $post
    ));
    return 'inserido';
}

function update_DB($val,$user,$post){
    global $pdo;
    $sql_set = "UPDATE upvotes SET valor = :val WHERE usuarios_id = :user AND postagens_id = :post";
    $linha = $pdo->prepare($sql_set);
    $linha->execute(array(
        ':val' => $val,
        ':user' => $user,
        ':post' => $post
    ));
    return 'atualizado';
}
?>
<?php #API para confirmações(papel/role,log out e card)
session_start();
require_once('headerConf.php');

$input = json_decode(file_get_contents('php://input'), true);
$dado = json_decode($input['tokenJWT'], true);
$exp = $dado['expiration'];
$jwt = $dado['token'][2];

//Quando recebo papel = 1(true) pela query, o php envia a lista de usuários para a página adm.jsx
if(isset($_GET['papel'])){
  if($jwt === $_SESSION['sigv'] && $exp > time()){
    //0 no BD significa maior privilégio, 1 para moderador e 2 para usuário comum
    if($_SESSION['papel'] === 0){
    require_once('pdo.php');
    $quer = $pdo->query("SELECT username,usuarios_id FROM usuarios");
    $res = $quer->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["users"=>$res]);
    return;
    }
  }
  
}

//O componente logout.jsx faz um request do nome do usuario
if(isset($_GET['nome'])){
    echo json_encode(['nome' => $_SESSION['nome']]);
    return;
}

//Se o usuario confirmar o logout ele destroi a sessão
if(isset($_GET['del'])){
  if($jwt === $_SESSION['sigv'] && $exp > time()){
    session_destroy();
    echo json_encode(['msg'=>'Logout']);
    return;
  }else{
    echo json_encode(['msg' => 'JWT inválido']);
    return;
  }
  }

  #PHP para o card do usuário(Account.jsx)
if($input['id']){
    $id = $input['id'];
}
$token = $dado['token'];

$sigv = $_SESSION['sigv'];

if($token[2] === $sigv){
    //Compara o unix-timestamp gerado pela react na hora do login com o atual gerado pelo php
   if($exp > time()){
    $valido = 1;
    $res = [$_SESSION['bio'], $_SESSION['foto']];
     
} else{
    $valido = 0;
   }
} else {
    $valido = 0;
}
echo json_encode([
        'valido' => 1,
        'nome' => $_SESSION['nome'],
        'username' => $_SESSION['username'],
        'bio' => $res[0],
        'foto' => base64_encode($res[1])
    ])

?>
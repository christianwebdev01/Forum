<?php #API para confirmações(papel/role,log out e card)
session_start();
require_once('headerConf.php');

$input = json_decode(file_get_contents('php://input'), true);
$dado = json_decode($input['tokenJWT'], true);
$exp = $dado['expiration'];
$jwt = $dado['token'][2];

//Quando recebo papel = 1(true) pela query, o php envia a lista de usuários para a página adm.jsx
if(isset($_GET['papel'])){
require_once('token_val.php');
$valido = validation($jwt,$exp);
if($valido && $_SESSION['papel'] === 0){
  require_once('pdo.php');
  $quer = $pdo->query("SELECT username,usuarios_id FROM usuarios");
  $res = $quer->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode(["users"=>$res]);
  exit();
} else{
  echo json_encode(['erro'=> 'Sem permissão']);
  exit();
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

require_once('token_val.php');
$valido = validation($token[2],$exp);

if($valido){
  echo json_encode([
    'valido' => 1,
    'nome' => $_SESSION['nome'],
    'username' => $_SESSION['username'],
    'bio' => $_SESSION['bio'],
    'foto' => base64_encode($_SESSION['foto'])
  ]);
} else{
echo json_encode(['erro'=> 'Não logado corretamente, faça o login']);
}

?>
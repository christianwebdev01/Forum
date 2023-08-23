<?php #API para login
require_once('headerConf.php');
session_start();

$dados = json_decode(file_get_contents('php://input'), true);

//teste

if(isset($_GET['voto'])){
  if($_SERVER['REQUEST_METHOD'] === 'POST'){
    require_once('pdo.php');

  //fetch de upvote
  if($_GET['voto'] === 'fetch'){
  $linha = $pdo->prepare("SELECT upvote FROM postagens WHERE postagens_id = 29");
  $linha->execute();
  $res = $linha->fetch(PDO::FETCH_ASSOC);
  echo json_encode(['fetch'=> $res['upvote']]);
  exit();
  }

  //upvote
  if($_GET['voto'] === '1'){
    $sql = "UPDATE postagens SET upvote = upvote + 1 WHERE postagens_id = 29";
    $linha = $pdo->prepare($sql);
    $linha->execute();
    echo json_encode(['msg' => 'upvote enviado']);
    exit();
  }
  }
}

//---

$username = htmlentities($dados['username']);

$arr = json_decode($dados['tokenJWT'],true);
$exp = $arr['expiration'];
$jwt = $arr['token'][2];

require_once('query.php');

if(isset($_GET['nav'])){
if($_SESSION['papel'] === 0){
  echo json_encode(['papel' => 1]);
  return;
}
}

if(isset($_GET['msg'])){
  if($jwt === $_SESSION['sigv'] && $exp > time()){
    echo json_encode(['msg' => $mensagens]);
  } else{
    echo json_encode(['erro' => 'Token expirado ou inválido']);
  }
  return;
}


//Fazer comparação dos dados recebidos com do do banco de dados
if(isset($dados['username'])){
  for($i = 0; $i < count($resultado); $i++){
    if(strtolower($resultado[$i]['username']) === strtolower($username)){
      if( $resultado[$i]['senha'] === hash('sha256', $dados['senha'])){
        //Dados do usuário
        $nome = $resultado[$i]['nome'];
        $usuarios_id = $resultado[$i]['usuarios_id'];
        $papel = $resultado[$i]['papel'];
        $novo_user = $resultado[$i]['novo_user'];

        //Criação do token web json
        $header = [
          'alg' => 'HS256',
          'typ'=> 'JWT'
        ];
        $header = json_encode($header);
        $header = base64_encode($header);

        $payload = [
          'name' => $nome,
          'usuarios_id' => $usuarios_id,
          'date' => time()
        ];
        $payload = json_encode($payload);
        $payload = base64_encode($payload);

        $chave = 'chaveJWTdontsharena0compartilhe9273';

        $signature = hash_hmac('sha256', $header.$payload , $chave);
        $signature = base64_encode($signature);

        $token = $header.'.'.$payload.'.'.$signature;
        $jwt = $token;
        $msg = 'Dados confirmam';

        //Signature verdadeira
        $chave = 'chaveJWTdontsharena0compartilhe9273';

        $sigv = $signature;

        //Sessões criadas ao fazer logins
        $_SESSION['sigv'] = $signature;
        $_SESSION['nome'] = $nome;
        $_SESSION['username'] = $resultado[$i]['username'];
        $_SESSION['usuarios_id'] = $usuarios_id;
        $_SESSION['papel'] = $papel;
        $_SESSION['novo_user'] =$novo_user;
        $_SESSION['foto'] = $resultado[$i]['foto'];
        $_SESSION['bio'] = $resultado[$i]['bio'];

        break;

      } else{
        $msg = 'Senha incorreta';
      } break;
    } else {
      $msg = 'Usuário não encontrado';
    }
  }
}
if($sigv){
$retorno = [
  'alerta' => $msg,
  'token' => $jwt
];
}else{
  $retorno = [
    'alerta' => $msg
  ];
}


echo json_encode($retorno); 
?>
<?php
$pdo = new PDO("mysql: host=127.0.0.1; port=33060; dbname=forum", 'christian', 'root');
$query = $pdo->query("SELECT * FROM usuarios");
$resultado = $query->fetchAll(PDO::FETCH_ASSOC);
##
$query2 = $pdo->prepare("SELECT * FROM notifications WHERE usuarios_id = :id");
$query2->bindParam(':id', $_SESSION['usuarios_id']);
$query2->execute();
$mensagens = $query2->fetchAll(PDO::FETCH_ASSOC);
##
?>
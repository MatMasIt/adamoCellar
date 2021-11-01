<?php
header("Content-Type: application/json");
$pdo = new PDO("sqlite:database.db");
$columns = ["vino", "cantina", "annata", "volume", "quantita", "note"];
//header("Content-Type: application/json");
switch ($_GET["intent"]) {
    case "list":
        $_GET["pageSize"] = (int) $_GET["pageSize"];
        $_GET["pageNum"] = (int) $_GET["pageNum"];

        $data = [];
        $addition = "";
        foreach ($columns as $e) {
            if (!empty($_GET[$e])) {
                $addition .= " $e LIKE ('%' || :$e || '%') AND ";
                $data[":" . $e] = $_GET[$e];
            }
        }
        $addition .= " 1=1 ";
        $sql = "SELECT * FROM Bottiglie WHERE $addition ";
        if (!in_array($_GET["orderBy"], $columns)) $by = "id";
        else $by = $_GET["orderBy"];
        if (in_array($_GET["orderHow"], ["ASC", "DESC"])) $how = $_GET["orderHow"];
        else $how = "ASC";
        $sql .= " ORDER BY $by $how";
        $sql .= " LIMIT " . $_GET["pageSize"] . " OFFSET " . ($_GET["pageSize"] * $_GET["pageNum"]);
        $p = $pdo->prepare($sql);
        $p->execute($data);
        $res = [];
        $res["rows"] = $p->fetchAll(PDO::FETCH_ASSOC);
        $sql = "SELECT COUNT(*) AS c FROM Bottiglie WHERE $addition";
        $p = $pdo->prepare($sql);
        $p->execute($data);
        $res["pagTot"] = (int)($p->fetch(PDO::FETCH_ASSOC)["c"] / $_GET["pageSize"]) + 1;
        echo json_encode($res);
        break;
    case "get":
        $p = $pdo->prepare("SELECT * FROM Bottiglie WHERE id=:id");
        $p->execute([":id" => $_GET["id"]]);
        echo json_encode($p->fetch(PDO::FETCH_ASSOC));
        break;
    case "delete":
        $p = $pdo->prepare("DELETE FROM Bottiglie WHERE id=:id");
        $p->execute([":id" => $_GET["id"]]);
        echo json_encode(["ok" => true]);
        break;
    case "update":
        $p = $pdo->prepare("UPDATE Bottiglie SET vino=:vino, cantina=:cantina, annata=:annata, volume=:volume, quantita=:quantita, note=:note, lastEdit=:lastEdit WHERE id=:id");
        $e = $p->execute([
            ":id" => $_GET["id"],
            ":vino" => $_GET["vino"],
            ":cantina" => $_GET["cantina"],
            ":annata" => $_GET["annata"],
            ":volume" => $_GET["volume"],
            ":quantita" => $_GET["quantita"],
            ":note" => $_GET["note"],
            ":lastEdit" => time()
        ]);
        echo json_encode(["ok" => $e]);
        break;
    case "add":
        $p = $pdo->prepare("INSERT INTO Bottiglie(vino, cantina, annata, volume, quantita, note, createdAt, lastEdit) VALUES(:vino, :cantina, :annata, :volume, :quantita, :note, :createdAt, :lastEdit)");
        $e = $p->execute([
            ":vino" => $_GET["vino"],
            ":cantina" => $_GET["cantina"],
            ":annata" => $_GET["annata"],
            ":volume" => $_GET["volume"],
            ":quantita" => $_GET["quantita"],
            ":note" => $_GET["note"],
            ":createdAt" => time(),
            ":lastEdit" => time()
        ]);
        echo json_encode(["ok" => $e]);
        break;
    case "complete":
        $type = $_GET["type"];
        if (!in_array($type, ["vino", "cantina", "annata", "volume", "quantita", "note"])) {
            echo json_encode([]);
            break;
        }
        $p = $pdo->prepare("SELECT DISTINCT $type FROM Bottiglie");
        $p->execute();
        $list = [];
        foreach ($p->fetchAll(PDO::FETCH_ASSOC) as $e) {
            $list[] = $e[$type];
        }
        $userInput = $_GET["query"];
        usort($list, function ($a, $b) use ($userInput) {
            similar_text($userInput, $a, $percentA);
            similar_text($userInput, $b, $percentB);

            return $percentA === $percentB ? 0 : ($percentA > $percentB ? -1 : 1);
        });
        echo json_encode(array_slice($list, 0, 20));
        break;
    case "access":
        echo json_encode(["ok" => password_verify($_GET["password"], file_get_contents("password.txt"))]);
        break;
    case "updatePassword":
        file_put_contents("password.txt", password_hash($_GET["password"], PASSWORD_DEFAULT));
        echo json_encode([]);
        break;
}

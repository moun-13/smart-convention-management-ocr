<?php

require __DIR__."/vendor/autoload.php";
$app = require_once __DIR__."/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\PieceJointe;
use Illuminate\Support\Facades\Storage;

foreach(PieceJointe::all() as $pj) {
    if (strpos($pj->nom_stockage, " ") !== false || preg_match("/[\x{0600}-\x{06FF}]/u", $pj->nom_stockage)) {
        $extension = pathinfo($pj->nom_stockage, PATHINFO_EXTENSION);
        if (!$extension) {
            $extension = "pdf";
        }
        $newName = time() . "_" . uniqid() . "." . $extension;
        $newChemin = "pieces_jointes/" . $newName;
        if (Storage::disk("public")->exists($pj->chemin)) {
            Storage::disk("public")->move($pj->chemin, $newChemin);
            echo "Moved " . $pj->chemin . " to " . $newChemin . PHP_EOL;
        } else {
            echo "File not found on disk: " . $pj->chemin . PHP_EOL;
        }
        $pj->nom_stockage = $newName;
        $pj->chemin = $newChemin;
        $pj->save();
        echo "Renamed DB record " . $pj->id . PHP_EOL;
    }
}

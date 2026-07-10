<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Convention;
use App\Models\Domaine;
use App\Models\Partenaire;
use App\Models\PorteurProjet;
use App\Models\Programme;
use App\Models\Province;
use App\Models\Secteur;
use App\Models\TypeConvention;

class DashboardController extends Controller
{
    public function statistiques()
    {
        return response()->json([
            'conventions' => Convention::count(),
            'secteurs' => Secteur::count(),
            'domaines' => Domaine::count(),
            'programmes' => Programme::count(),
            'provinces' => Province::count(),
            'typesConvention' => TypeConvention::count(),
            'porteursProjet' => PorteurProjet::count(),
            'partenaires' => Partenaire::count(),
        ]);
    }
}

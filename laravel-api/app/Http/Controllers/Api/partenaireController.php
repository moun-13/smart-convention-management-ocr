<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partenaire;
use Illuminate\Http\Request;

class PartenaireController extends Controller
{
    // Liste
    public function index()
    {
        return response()->json(
            Partenaire::orderBy('nom')->get()
        );
    }

    // Ajouter
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:partenaires,nom',
        ]);

        $partenaire = Partenaire::create($validated);

        return response()->json($partenaire, 201);
    }

    // Afficher
    public function show(Partenaire $partenaire)
    {
        return response()->json($partenaire);
    }

    // Modifier
    public function update(Request $request, Partenaire $partenaire)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:partenaires,nom,' . $partenaire->id,
        ]);

        $partenaire->update($validated);

        return response()->json($partenaire);
    }

    // Supprimer
    public function destroy(Partenaire $partenaire)
    {
        $partenaire->delete();

        return response()->json([
            'message' => 'Partenaire supprimé avec succès.'
        ]);
    }
}
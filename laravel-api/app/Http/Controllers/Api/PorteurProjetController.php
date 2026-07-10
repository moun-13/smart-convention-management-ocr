<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PorteurProjet;
use Illuminate\Http\Request;

class PorteurProjetController extends Controller
{
    // Liste
    public function index()
    {
        return response()->json(
            PorteurProjet::orderBy('nom')->get()
        );
    }

    // Ajouter
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:porteur_projets,nom',
        ]);

        $porteur = PorteurProjet::create($validated);

        return response()->json($porteur, 201);
    }

    // Afficher
    public function show(PorteurProjet $porteurProjet)
    {
        return response()->json($porteurProjet);
    }

    // Modifier
    public function update(Request $request, PorteurProjet $porteurProjet)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:porteur_projets,nom,' . $porteurProjet->id,
        ]);

        $porteurProjet->update($validated);

        return response()->json($porteurProjet);
    }

    // Supprimer
    public function destroy(PorteurProjet $porteurProjet)
    {
        $porteurProjet->delete();

        return response()->json([
            'message' => 'Porteur de projet supprimé avec succès.'
        ]);
    }
}
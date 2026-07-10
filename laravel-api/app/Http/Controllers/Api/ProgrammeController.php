<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use Illuminate\Http\Request;

class ProgrammeController extends Controller
{
    // Liste des programmes
    public function index()
    {
        return response()->json(
            Programme::orderBy('nom')->get()
        );
    }

    // Ajouter un programme
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:programmes,nom',
        ]);

        $programme = Programme::create($validated);

        return response()->json($programme, 201);
    }

    // Afficher un programme
    public function show(Programme $programme)
    {
        return response()->json($programme);
    }

    // Modifier un programme
    public function update(Request $request, Programme $programme)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:programmes,nom,' . $programme->id,
        ]);

        $programme->update($validated);

        return response()->json($programme);
    }

    // Supprimer un programme
    public function destroy(Programme $programme)
    {
        $programme->delete();

        return response()->json([
            'message' => 'Programme supprimé avec succès.'
        ]);
    }
}
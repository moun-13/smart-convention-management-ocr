<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Province;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    // Liste des provinces
    public function index()
    {
        return response()->json(
            Province::orderBy('nom')->get()
        );
    }

    // Ajouter une province
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:provinces,nom',
        ]);

        $province = Province::create($validated);

        return response()->json($province, 201);
    }

    // Afficher une province
    public function show(Province $province)
    {
        return response()->json($province);
    }

    // Modifier une province
    public function update(Request $request, Province $province)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:provinces,nom,' . $province->id,
        ]);

        $province->update($validated);

        return response()->json($province);
    }

    // Supprimer une province
    public function destroy(Province $province)
    {
        $province->delete();

        return response()->json([
            'message' => 'Province supprimée avec succès.'
        ]);
    }
}
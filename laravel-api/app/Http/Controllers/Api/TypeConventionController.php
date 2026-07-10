<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeConvention;
use Illuminate\Http\Request;

class TypeConventionController extends Controller
{
    // Liste des types
    public function index()
    {
        return response()->json(
            TypeConvention::orderBy('nom')->get()
        );
    }

    // Ajouter
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:type_conventions,nom',
        ]);

        $typeConvention = TypeConvention::create($validated);

        return response()->json($typeConvention, 201);
    }

    // Afficher
    public function show(TypeConvention $typeConvention)
    {
        return response()->json($typeConvention);
    }

    // Modifier
    public function update(Request $request, TypeConvention $typeConvention)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:type_conventions,nom,' . $typeConvention->id,
        ]);

        $typeConvention->update($validated);

        return response()->json($typeConvention);
    }

    // Supprimer
    public function destroy(TypeConvention $typeConvention)
    {
        $typeConvention->delete();

        return response()->json([
            'message' => 'Type de convention supprimé avec succès.'
        ]);
    }
}
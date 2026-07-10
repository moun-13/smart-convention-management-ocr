<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Secteur;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class SecteurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Liste des secteurs
        return response()->json(
            Secteur::orderBy('nom')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Ajouter un secteur
        $validated = $request->validate([
            'nom'=> 'required|string|max:255|unique:secteurs,nom',
        ]);
        $secteur = Secteur::create($validated);
        return response()->json($secteur,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Secteur $secteur)
    {
        //Afficher un secteur
        return response()->json($secteur);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Secteur $secteur)
    {
        //Modifier un secteur
        $validated =  $request->validate([
            'nom' => 'required|string|max:255|unique:secteurs,nom,'. $secteur->id,
        ]);
        $secteur->update($validated);
        return response()->json($secteur);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Secteur $secteur)
    {
        //Supprimer un secteur

        $secteur->delete();
        return response()->json([
            'message' => 'Secteur supprimé avec succès.'
        ]);
    }
}

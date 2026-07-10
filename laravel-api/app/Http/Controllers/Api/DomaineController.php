<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domaine;
use Illuminate\Http\Request;

class DomaineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Domaine::orderBy('nom')->get()
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
           'nom' => 'required|unique:domaines',
        ]);
        $domaine = Domaine::create($validated);
        return response()->json($domaine,201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Domaine  $domaine)
    {
        return response()->json($domaine);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Domaine $domaine)
    {
        $validated = $request->validate([
            'nom' => 'required|unique:domaines,nom,'.$domaine->id
        ]);

        $domaine->update($validated);

        return response()->json($domaine);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Domaine $domaine)
    {
        $domaine->delete();
        return response()->json([
           'message'=>'Domaine supprimé avec succès.'
        ]);
    }
}

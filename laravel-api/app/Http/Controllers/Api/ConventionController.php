<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Convention;
use Illuminate\Http\Request;

class ConventionController extends Controller
{
    private array $relations = [
        'secteur',
        'domaine',
        'programme',
        'province',
        'typeConvention',
        'porteurProjet',
        'porteurDelegue',
        'partenaires',
        'piecesJointes',
    ];

    public function index(Request $request)
    {
        $query = Convention::with($this->relations);

        if ($request->filled('numero')) {
            $query->where('numero', 'like', '%' . $request->input('numero') . '%');
        }

        if ($request->filled('annee')) {
            $query->where('annee', $request->annee);
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        foreach ([
            'secteur_id',
            'domaine_id',
            'programme_id',
            'province_id',
            'type_convention_id',
            'porteur_projet_id',
        ] as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->input($field));
            }
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        if ($request->user()) {
            $validated['created_by'] = $request->user()->id;
        }

        $convention = Convention::create($validated);

        if ($request->has('partenaires')) {
            $convention->partenaires()->sync($request->input('partenaires'));
        }

        return response()->json($convention->load($this->relations), 201);
    }

    public function show(Convention $convention)
    {
        return response()->json($convention->load($this->relations));
    }

    public function update(Request $request, Convention $convention)
    {
        $validated = $request->validate($this->rules($convention));

        $convention->update($validated);

        if ($request->has('partenaires')) {
            $convention->partenaires()->sync($request->partenaires);
        }

        return response()->json($convention->load($this->relations));
    }

    public function destroy(Convention $convention)
    {
        $convention->partenaires()->detach();
        $convention->delete();

        return response()->json([
            'message' => 'Convention supprimee avec succes.',
        ]);
    }

    private function rules(?Convention $convention = null): array
    {
        $id = $convention?->id;

        return [
            'numero' => [$id ? 'sometimes' : 'required', 'required', 'string', 'unique:conventions,numero' . ($id ? ',' . $id : '')],
            'date_convention' => [$id ? 'sometimes' : 'required', 'required', 'date'],
            'annee' => [$id ? 'sometimes' : 'required', 'required', 'integer'],
            'session' => 'nullable|string',
            'cout_total' => 'nullable|numeric',
            'contribution_region' => 'nullable|numeric',
            'description' => 'nullable|string',
            'numero_decision' => 'nullable|string',
            'date_debut' => 'nullable|date',
            'statut' => 'nullable|string',
            'secteur_id' => [$id ? 'sometimes' : 'required', 'required', 'exists:secteurs,id'],
            'domaine_id' => 'nullable|exists:domaines,id',
            'programme_id' => 'nullable|exists:programmes,id',
            'province_id' => 'nullable|exists:provinces,id',
            'type_convention_id' => 'nullable|exists:type_conventions,id',
            'porteur_projet_id' => 'nullable|exists:porteur_projets,id',
            'porteur_delegue_id' => 'nullable|exists:porteur_projets,id',
            'partenaires' => 'nullable|array',
            'partenaires.*' => 'exists:partenaires,id',
        ];
    }
}

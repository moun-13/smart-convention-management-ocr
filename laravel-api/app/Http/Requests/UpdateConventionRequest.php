<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateConventionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'numero' => 'sometimes|required|string|unique:conventions,numero,' . $this->route('convention')?->id,
            'date_convention' => 'sometimes|required|date',
            'annee' => 'sometimes|required|integer',
            'session' => 'nullable|string',
            'cout_total' => 'nullable|numeric',
            'contribution_region' => 'nullable|numeric',
            'description' => 'nullable|string',
            'numero_decision' => 'nullable|string',
            'date_debut' => 'nullable|date',
            'secteur_id' => 'sometimes|required|exists:secteurs,id',
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

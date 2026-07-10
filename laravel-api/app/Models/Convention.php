<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Convention extends Model
{
    protected $fillable = [
        'numero',
        'date_convention',
        'annee',
        'session',
        'cout_total',
        'contribution_region',
        'description',
        'numero_decision',
        'date_debut',
        'statut',
        'secteur_id',
        'domaine_id',
        'programme_id',
        'province_id',
        'type_convention_id',
        'porteur_projet_id',
        'porteur_delegue_id',
        'created_by',
    ];

    public function secteur(): BelongsTo
    {
        return $this->belongsTo(Secteur::class);
    }


    public function domaine(): BelongsTo
    {
        return $this->belongsTo(Domaine::class);
    }

    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function typeConvention(): BelongsTo
    {
        return $this->belongsTo(TypeConvention::class);
    }

    public function porteurProjet(): BelongsTo
    {
        return $this->belongsTo(PorteurProjet::class);
    }

    public function porteurDelegue(): BelongsTo
    {
        return $this->belongsTo(PorteurProjet::class, 'porteur_delegue_id');
    }

    public function createur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function partenaires(): BelongsToMany
    {
        return $this->belongsToMany(
            Partenaire::class,
            'convention_partenaire'
        );
    }

    public function piecesJointes(): HasMany
    {
        return $this->hasMany(PieceJointe::class);
    }


}

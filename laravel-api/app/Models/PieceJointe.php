<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PieceJointe extends Model
{
    protected $fillable = [
        'convention_id',
        'nom_original',
        'nom_stockage',
        'mime_type',
        'taille',
        'chemin',
    ];

    public function convention(): BelongsTo
    {
        return $this->belongsTo(Convention::class);
    }
}
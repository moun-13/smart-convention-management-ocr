<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partenaire extends Model
{
    protected $fillable = [
        'nom',
    ];

    public function conventions(): BelongsToMany
    {
        return $this->belongsToMany(
            Convention::class,
            'convention_partenaire'
        );
    }
}
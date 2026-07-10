<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PorteurProjet extends Model
{
    protected $fillable = [
        'nom',
    ];

    public function conventions(): HasMany
    {
        return $this->hasMany(Convention::class);
    }
}
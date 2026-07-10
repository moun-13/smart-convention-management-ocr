<?php

namespace Database\Seeders;

use App\Models\TypeConvention;
use Illuminate\Database\Seeder;

class TypeConventionSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'اتفاقية شراكة',
            'اتفاقية تمويل',
            'اتفاقية تعاون',
            'اتفاقية دعم'
        ];

        foreach ($types as $nom) {
            TypeConvention::firstOrCreate([
                'nom' => $nom
            ]);
        }
    }
}
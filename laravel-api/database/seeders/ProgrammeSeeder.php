<?php

namespace Database\Seeders;

use App\Models\Programme;
use Illuminate\Database\Seeder;

class ProgrammeSeeder extends Seeder
{
    public function run(): void
    {
        $programmes = [
            'برنامج التنمية',
            'برنامج الاستثمار',
            'برنامج التشغيل',
            'برنامج التأهيل',
            'برنامج الشباب',
        ];

        foreach ($programmes as $nom) {
            Programme::firstOrCreate([
                'nom' => $nom
            ]);
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Seeder;

class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            'أكادير إداوتنان',
            'إنزكان آيت ملول',
            'اشتوكة آيت باها',
            'تارودانت',
            'تيزنيت',
            'طاطا'
        ];

        foreach ($provinces as $nom) {
            Province::firstOrCreate([
                'nom' => $nom
            ]);
        }
    }
}
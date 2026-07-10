<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Partenaire;

use Illuminate\Database\Seeder;

class PartenaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $partenaires = [
             'جامعة ابن زهر',
            'وزارة الفلاحة',
            'وكالة الحوض المائي',
            'المبادرة الوطنية للتنمية البشرية',
            'الجماعة الترابية',
            'وزارة الاقتصاد والمالية'

        ];
        foreach($partenaires as $partenaire){
            Partenaire::firstOrCreate([
                'nom' => $partenaire
                ]);
        }
    }
}

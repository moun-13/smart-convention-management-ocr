<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\PorteurProjet;
use Illuminate\Database\Seeder;

class PorteurProjetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $porteurs = [
            'مجلس جهة سوس ماسة',
            'وزارة الفلاحة',
            'وزارة الصحة',
            'جامعة ابن زهر',
            'وكالة الحوض المائي'
        ];
        foreach($porteurs as $nom){
            PorteurProjet::firstOrCreate([
                'nom' => $nom
            ]);

        }
    }
}

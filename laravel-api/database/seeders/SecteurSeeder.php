<?php

namespace Database\Seeders;

use App\Models\Secteur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SecteurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 
        $secteur =[
             'الري',
            'تربية الماشية',
            'المستشفيات',
            'التعليم الابتدائي',
            'التعليم العالي',
            'البيئة الساحلية',];
        foreach($secteur as $nom){
            Secteur::firstOrCreate([
                'nom'=>$nom
            ]);
        }
    }
}

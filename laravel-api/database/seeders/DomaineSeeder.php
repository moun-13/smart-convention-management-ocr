<?php

namespace Database\Seeders;

use App\Models\Domaine;
use Illuminate\Database\Seeder;

class DomaineSeeder extends Seeder
{
    public function run(): void
    {
        Domaine::insert([
            ['nom'=>'الري'],
            ['nom'=>'تربية الماشية'],
            ['nom'=>'التعليم العالي'],
            ['nom'=>'المستشفيات'],
        ]);
    }
}
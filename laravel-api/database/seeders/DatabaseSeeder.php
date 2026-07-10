<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AdminSeeder::class,
            SecteurSeeder::class,
            DomaineSeeder::class,
            ProgrammeSeeder::class,
            ProvinceSeeder::class,
            TypeConventionSeeder::class,
            PorteurProjetSeeder::class,
            PartenaireSeeder::class,

        ]);
    }
}
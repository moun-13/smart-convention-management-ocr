<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@pfa.ma'],
            [
                'name' => 'Administrateur',
                'email' => 'admin@pfa.ma',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
            ]
        );
    }
}

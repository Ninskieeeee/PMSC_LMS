<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin Reggie',
            'email' => 'admin@pmscclarin.edu.ph',
            'password' => 'Admin@12345',
            'role' => 'admin',
            'access_code' => 'ADM-00001',
        ]);

        $this->command?->info('Seeded the admin account:');
        $this->command?->table(['Role', 'Access Code', 'Password'], [
            ['Admin', $admin->access_code, 'Admin@12345'],
        ]);
    }
}

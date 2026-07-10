<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'editor', 'decideur'])
                ->default('editor')
                ->after('password');
        });

        if (Schema::hasColumn('users', 'role_id') && Schema::hasTable('roles')) {
            DB::table('users')
                ->leftJoin('roles', 'users.role_id', '=', 'roles.id')
                ->whereIn('roles.name', ['admin', 'editor', 'decideur'])
                ->update(['users.role' => DB::raw('roles.name')]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};

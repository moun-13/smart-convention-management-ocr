<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('convention_partenaire', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('convention_id')
              ->constrained()
              ->cascadeOnDelete();

            $table->foreignId('partenaire_id')
              ->constrained()
              ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convention_partenaire');
    }
};

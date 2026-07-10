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
        Schema::create('conventions', function (Blueprint $table) {

            $table->id();

            // Informations générales
            $table->string('numero')->unique();
            $table->date('date_convention');
            $table->year('annee');
            $table->string('session')->nullable();

            $table->decimal('cout_total', 15, 2)->default(0);
            $table->decimal('contribution_region', 15, 2)->default(0);

            $table->text('description')->nullable();

            $table->string('numero_decision')->nullable();

            $table->date('date_debut')->nullable();

            $table->enum('statut', [
                'في الانتظار',
                'مقبولة',
                'مرفوضة'
            ])->default('في الانتظار');

            /*
            
            Relations
            
            */

            $table->foreignId('secteur_id')
                ->constrained('secteurs')
                ->cascadeOnDelete();

            $table->foreignId('domaine_id')
                ->nullable()
                ->constrained('domaines')
                ->nullOnDelete();

            $table->foreignId('programme_id')
                ->nullable()
                ->constrained('programmes')
                ->nullOnDelete();

            $table->foreignId('province_id')
                ->nullable()
                ->constrained('provinces')
                ->nullOnDelete();

            $table->foreignId('type_convention_id')
                ->nullable()
                ->constrained('type_conventions')
                ->nullOnDelete();

            $table->foreignId('porteur_projet_id')
                ->nullable()
                ->constrained('porteur_projets')
                ->nullOnDelete();

            $table->foreignId('porteur_delegue_id')
                ->nullable()
                ->constrained('porteur_projets')
                ->nullOnDelete();

            /*
            
             Utilisateurs
            
            */

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('validated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('validated_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conventions');
    }
};
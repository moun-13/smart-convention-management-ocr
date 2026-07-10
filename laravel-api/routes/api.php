<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConventionController;
use App\Http\Controllers\Api\DomaineController;
use App\Http\Controllers\Api\SecteurController;
use App\Http\Controllers\Api\ProgrammeController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\TypeConventionController;
use App\Http\Controllers\Api\PorteurProjetController;
use App\Http\Controllers\Api\PartenaireController;
use App\Http\Controllers\Api\PieceJointeController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel fonctionne !'
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/conventions', [ConventionController::class, 'index'])
        ->middleware('role:admin,editor,decideur');
    Route::get('/conventions/{convention}', [ConventionController::class, 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::post('/conventions', [ConventionController::class, 'store'])
        ->middleware('role:admin,editor');
    Route::put('/conventions/{convention}', [ConventionController::class, 'update'])
        ->middleware('role:admin,editor');
    Route::patch('/conventions/{convention}', [ConventionController::class, 'update'])
        ->middleware('role:admin,editor');
    Route::delete('/conventions/{convention}', [ConventionController::class, 'destroy'])
        ->middleware('role:admin');

    Route::apiResource('secteurs', SecteurController::class)
        ->only(['index', 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::apiResource('secteurs', SecteurController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin');

    Route::apiResource('domaines', DomaineController::class)
        ->only(['index', 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::apiResource('domaines', DomaineController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin');

    Route::apiResource('programmes', ProgrammeController::class)
        ->only(['index', 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::apiResource('programmes', ProgrammeController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin');

    Route::apiResource('provinces', ProvinceController::class)
        ->only(['index', 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::apiResource('provinces', ProvinceController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin');

    Route::apiResource('type-conventions', TypeConventionController::class)
        ->only(['index', 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::apiResource('type-conventions', TypeConventionController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin');

    Route::apiResource('porteur-projets', PorteurProjetController::class)
        ->only(['index', 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::apiResource('porteur-projets', PorteurProjetController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin');

    Route::apiResource('partenaires', PartenaireController::class)
        ->only(['index', 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::apiResource('partenaires', PartenaireController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin');

    Route::apiResource('piece-jointes', PieceJointeController::class)
        ->only(['index', 'show'])
        ->middleware('role:admin,editor,decideur');
    Route::apiResource('piece-jointes', PieceJointeController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin,editor');
    Route::post('/ocr/extract', [PieceJointeController::class, 'extract'])
        ->middleware('role:admin,editor');

    Route::get('/dashboard/statistiques', [DashboardController::class, 'statistiques'])
        ->middleware('role:admin,decideur');
    Route::get('/piece-jointes/{pieceJointe}/download', [PieceJointeController::class, 'download'])
        ->middleware('role:admin,editor,decideur');
    
    Route::apiResource('users', UserController::class)
        ->middleware('role:admin');


});



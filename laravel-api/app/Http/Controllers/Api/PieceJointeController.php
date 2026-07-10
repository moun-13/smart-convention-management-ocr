<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use App\Models\PieceJointe;
use App\Models\Convention;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PieceJointeController extends Controller
{
    /**
     * Liste des pièces jointes
     */
    public function index()
    {
        return response()->json(
            PieceJointe::with('convention')->latest()->get()
        );
    }

    /**
     * Upload d'une pièce jointe
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'convention_id' => 'required|exists:conventions,id',
            'fichier' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $fichier = $request->file('fichier');

        $nomOriginal = $fichier->getClientOriginalName();
        $extension = $fichier->getClientOriginalExtension() ?: $fichier->guessExtension();

        $nomStockage = time() . '_' . uniqid() . '.' . $extension;

        $chemin = $fichier->storeAs(
            'pieces_jointes',
            $nomStockage,
            'public',
        );

        // Envoyer le PDF au service OCR avec un timeout plus long car l'OCR peut prendre du temps
        try {
            $response = Http::timeout(120)->attach(
                'file',
                fopen(storage_path('app/public/' . $chemin), 'r'),
                $nomOriginal
            )->post('http://127.0.0.1:8001/extract');

            if ($response->failed()) {
                return response()->json([
                    'message' => 'Erreur lors de l\'extraction OCR par le service FastAPI.',
                    'details' => $response->json() ?? $response->body()
                ], 500);
            }

            $ocrData = $response->json();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Impossible de joindre le service OCR.',
                'error' => $e->getMessage()
            ], 500);
        }

        $pieceJointe = PieceJointe::create([
            'convention_id' => $validated['convention_id'],
            'nom_original' => $nomOriginal,
            'nom_stockage' => $nomStockage,
            'chemin' => $chemin,
            'mime_type' => $fichier->getMimeType(),
            'taille' => $fichier->getSize(),
        ]);
         
        return response()->json([
            'message'=> 'Fichier uploadé avec succès',
            'piece_jointe' => $pieceJointe,
            'ocr'=> $ocrData,
        ], 201);
    }

    /**
     * Extraction OCR directe via API FastAPI
     */
    public function extract(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        try {
            $response = Http::timeout(120)->attach(
                'file',
                fopen($request->file('file')->getPathname(), 'r'),
                $request->file('file')->getClientOriginalName()
            )->post('http://127.0.0.1:8001/extract');

            if ($response->failed()) {
                return response()->json([
                    'message' => 'Erreur lors de l\'extraction OCR par le service FastAPI.',
                    'details' => $response->json() ?? $response->body()
                ], 500);
            }

            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Impossible de joindre le service OCR.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une pièce jointe
     */
    public function show(PieceJointe $pieceJointe)
    {
        return response()->json($pieceJointe);
    }

    /**
     * Mise à jour (non utilisée)
     */
    public function update(Request $request, PieceJointe $pieceJointe)
    {
        return response()->json([
            'message' => 'Aucune modification autorisée.'
        ]);
    }

    /**
     * Supprimer une pièce jointe
     */
    public function destroy(PieceJointe $pieceJointe)
    {
        Storage::disk('public')->delete($pieceJointe->chemin);

        $pieceJointe->delete();

        return response()->json([
            'message' => 'Pièce jointe supprimée avec succès.'
        ]);
    }
    
    public function download(PieceJointe $pieceJointe)
{
    $path = storage_path('app/public/' . $pieceJointe->chemin);

    if (!file_exists($path)) {
        return response()->json([
            'message' => 'Fichier introuvable.'
        ], 404);
    }

    return response()->download($path, $pieceJointe->nom_original);
}
}
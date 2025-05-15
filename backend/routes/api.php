<?php

use App\Http\Controllers\TupadController;
use App\Http\Controllers\TupadPaperController;
use App\Http\Controllers\GipPaperController;
use App\Http\Controllers\AdlPaperController;
use Illuminate\Support\Facades\Route;

// Route::apiResource('tupad_papers', TupadPaperController::class);
// Route::get('/tupads_papers/{id}', [TupadPaperController::class, 'show']);
// Route::get('/tupads_papers/tupad/{tupad_id}', [TupadPaperController::class, 'showByTupadId']);

Route::post('/tupads', [TupadController::class, 'storeOrUpdate']); // Create new
Route::put('/tupads/{id}', [TupadController::class, 'storeOrUpdate']); // Update existing
Route::get('/tupads', [TupadController::class, 'getAll']);
Route::get('/tupads/latest-series/{pfo}', [TupadController::class, 'getLatestSeriesNo']);
Route::get('/tupad/{id}', [TupadController::class, 'show']); // Get specific record
Route::put('/tupad/{id}', [TupadController::class, 'update']); // Update record
Route::get('/tupad/{id}', [TupadController::class, 'getTupadDetails']);

Route::apiResource('gip_papers', GipPaperController::class);
Route::get('/gip_papers/{id}', [GipPaperController::class, 'show']);
Route::get('/gip_papers/gip/{tupad_id}', [GipPaperController::class, 'showByTupadId']);

Route::apiResource('adl_papers', AdlPaperController::class);
Route::get('/adl_papers/{id}', [AdlPaperController::class, 'show']);
Route::get('/adl_papers/adl/{tupad_id}', [AdlPaperController::class, 'showByTupadId']);


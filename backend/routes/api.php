<?php

use App\Http\Controllers\TupadController;
use App\Http\Controllers\TupadPaperController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tupad_papers', TupadPaperController::class);
Route::get('/tupads_papers/{id}', [TupadPaperController::class, 'show']);
Route::get('/tupads_papers/tupad/{tupad_id}', [TupadPaperController::class, 'showByTupadId']);

Route::post('/tupads', [TupadController::class, 'storeOrUpdate']); // Create new
Route::put('/tupads/{id}', [TupadController::class, 'storeOrUpdate']); // Update existing
Route::get('/tupads', [TupadController::class, 'getAll']);
Route::get('/tupads/latest-series/{pfo}', [TupadController::class, 'getLatestSeriesNo']);
Route::get('/tupad/{id}', [TupadController::class, 'show']); // Get specific record
Route::put('/tupad/{id}', [TupadController::class, 'update']); // Update record
Route::get('/tupad/{id}', [TupadController::class, 'getTupadDetails']);


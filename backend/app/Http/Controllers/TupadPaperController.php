<?php

namespace App\Http\Controllers;

use App\Models\Tupad;
use App\Models\TupadPaper;
use Illuminate\Http\Request;

class TupadPaperController extends Controller
{
    // Get all Tupad Papers
    public function index()
    {
        return response()->json(TupadPaper::all(), 200);
    }

    // Store a new Tupad Paper
    public function store(Request $request)
{
    $request->validate([
        'tupad_id' => 'required|exists:tupads,id',
        'tssd' => 'nullable|date',
        'budget' => 'nullable|date',
        'imsd_chief' => 'nullable|date',
        'ard' => 'nullable|date',
        'rd' => 'nullable|date',
        'process' => 'nullable|date',
        'budget_accounting' => 'nullable|date',
        'accounting' => 'nullable|date',
        'payment_status' => 'nullable|string|max:255',
    ]);

    // Check if a record already exists for this tupad_id
    $paper = TupadPaper::where('tupad_id', $request->tupad_id)->first();

    if ($paper) {
        // Update existing record (preserve existing status)
        $paper->update($request->all());
    } else {
        // Create a new record with status always set to 'Pending'
        $paper = TupadPaper::create(array_merge($request->all(), ['status' => 'Pending']));
    }

    // Check if all required fields are filled, then set payment_status to "Paid"
    if (
        !empty($paper->tssd) &&
        !empty($paper->budget) &&
        !empty($paper->imsd_chief) &&
        !empty($paper->ard) &&
        !empty($paper->rd) &&
        !empty($paper->process) &&
        !empty($paper->budget_accounting) &&
        !empty($paper->accounting)
    ) {
        $paper->update(['payment_status' => 'Paid']);
    }

    // Check if some fields are filled to update status in Tupad table
    if (
        !empty($paper->tssd) &&
        !empty($paper->budget) &&
        !empty($paper->imsd_chief) &&
        !empty($paper->ard) &&
        !empty($paper->rd)
    ) {
        $tupad = Tupad::find($request->tupad_id);
        if ($tupad) {
            $tupad->update(['status' => 'Implemented']);
        }
    }

    return response()->json([
        'message' => $paper->wasRecentlyCreated ? 'Created successfully' : 'Updated successfully',
        'data' => $paper
    ], $paper->wasRecentlyCreated ? 201 : 200);
}



    public function show($id)
{
    $paper = TupadPaper::find($id);

    if ($paper && $paper->tupad_id) {
        $correctPaper = TupadPaper::where('tupad_id', $paper->tupad_id)->first();

        if ($correctPaper) {
            return response()->json($correctPaper, 200);
        }
    }

    return response()->json(['message' => 'Paper not found for the selected row'], 404);
}

public function showByTupadId($tupad_id)
{
    // Find by `tupad_id`
    $paper = TupadPaper::where('tupad_id', $tupad_id)->first();

    // If not found, return an error
    if (!$paper) {
        return response()->json(['message' => 'Paper not found for the given Tupad ID'], 404);
    }

    return response()->json($paper, 200);
}


    
    // Update a Tupad Paper
    public function update(Request $request, $id)
    {
        $paper = TupadPaper::find($id);

        if (!$paper) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|max:50',
            'date_received' => 'nullable|date',
        ]);

        $paper->update($request->all());

        return response()->json($paper, 200);
    }

    // Delete a Tupad Paper
    public function destroy($id)
    {
        $paper = TupadPaper::find($id);

        if (!$paper) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        $paper->delete();

        return response()->json(['message' => 'Paper deleted successfully'], 200);
    }


}

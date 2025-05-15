<?php

namespace App\Http\Controllers;

use App\Models\Tupad;
use App\Models\AdlPaper;
use Illuminate\Http\Request;

class AdlPaperController extends Controller
{
    // Get all Tupad Papers
    public function index()
    {
        return response()->json(AdlPaper::all(), 200);
    }

    // Store a new Tupad Paper
    public function store(Request $request)
{
    $request->validate([
        'tupad_id' => 'required|exists:tupads,id',
        'budget' => 'nullable|date',
        'r_budget' => 'nullable|date',
        'rt_budget' => 'nullable|date',
        'tssd' => 'nullable|date',
        'r_tssd' => 'nullable|date',
        'accounting' => 'nullable|date',
        'r_accounting' => 'nullable|date',
    ]);

    // Check if a record already exists for this tupad_id
    $papers = AdlPaper::where('tupad_id', $request->tupad_id)->first();

    if ($papers) {
        // Update existing record (preserve existing status)
        $papers->update($request->all());
    } else {
        // Create a new record with status always set to 'Pending'
        $papers = AdlPaper::create(array_merge($request->all(), ['status' => 'Pending']));
    }

    return response()->json([
        'message' => $papers->wasRecentlyCreated ? 'Created successfully' : 'Updated successfully',
        'data' => $papers
    ], $papers->wasRecentlyCreated ? 201 : 200);
}



    public function show($id)
{
    $papers = AdlPaper::find($id);

    if ($papers && $papers->tupad_id) {
        $correctPapers = AdlPaper::where('tupad_id', $papers->tupad_id)->first();

        if ($correctPapers) {
            return response()->json($correctPapers, 200);
        }
    }

    return response()->json(['message' => 'Paper not found for the selected row'], 404);
}

public function showByTupadId($tupad_id)
{
    // Find by `tupad_id`
    $papers = AdlPaper::where('tupad_id', $tupad_id)->first();

    // If not found, return an error
    if (!$papers) {
        return response()->json(['message' => 'Paper not found for the given Tupad ID'], 404);
    }

    return response()->json($papers, 200);
}


    
    // Update a Tupad Paper
    public function update(Request $request, $id)
    {
        $papers = AdlPaper::find($id);

        if (!$papers) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|max:50',
            'date_received' => 'nullable|date',
        ]);

        $papers->update($request->all());

        return response()->json($papers, 200);
    }

    // Delete a Tupad Paper
    public function destroy($id)
    {
        $papers = AdlPaper::find($id);

        if (!$papers) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        $paper->delete();

        return response()->json(['message' => 'Paper deleted successfully'], 200);
    }


}

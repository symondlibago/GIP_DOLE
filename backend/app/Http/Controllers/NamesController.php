<?php

namespace App\Http\Controllers;

use App\Models\Tupad;
use App\Models\Names;
use Illuminate\Http\Request;

class NamesController extends Controller
{
    public function index()
    {
        return response()->json(Names::all(), 200);
    }

    // Store a new Tupad Paper
    public function store(Request $request)
{
    $request->validate([
        'tssd' => 'nullable|date',
        'r_tssd' => 'nullable|date',
        'name' => 'nullable|array',


    ]);

    // Check if a record already exists for this tupad_id
    $names = Names::where('tupad_id', $request->tupad_id)->first();

    if ($names) {
        // Update existing record (preserve existing status)
        $names->update($request->all());
    } else {
        // Create a new record with status always set to 'Pending'
        $names = Names::create(array_merge($request->all(), ['status' => 'Pending']));
    }

    return response()->json([
        'message' => $names->wasRecentlyCreated ? 'Created successfully' : 'Updated successfully',
        'data' => $names
    ], $names->wasRecentlyCreated ? 201 : 200);
}



    public function show($id)
{
    $names = Names::find($id);

    if ($names && $names->tupad_id) {
        $correctPaper = Names::where('tupad_id', $paper->tupad_id)->first();

        if ($correctPaper) {
            return response()->json($correctPaper, 200);
        }
    }

    return response()->json(['message' => 'Paper not found for the selected row'], 404);
}

public function showByTupadId($tupad_id)
{
    // Find by `tupad_id`
    $names = Names::where('tupad_id', $tupad_id)->first();

    // If not found, return an error
    if (!$names) {
        return response()->json(['message' => 'Paper not found for the given Tupad ID'], 404);
    }

    return response()->json($names, 200);
}


    
    // Update a Tupad Paper
    public function update(Request $request, $id)
    {
        $names = Names::find($id);

        if (!$names) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|max:50',
            'date_received' => 'nullable|date',
        ]);

        $names->update($request->all());

        return response()->json($names, 200);
    }

    // Delete a Tupad Paper
    public function destroy($id)
    {
        $names = Names::find($id);

        if (!$names) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        $names->delete();

        return response()->json(['message' => 'Paper deleted successfully'], 200);
    }


}

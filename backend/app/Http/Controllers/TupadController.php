<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tupad;

class TupadController extends Controller
{

    public function index()
{
    $tupads = Tupad::with('history')->get();
    

    // Count occurrences for each PFO
    $pfoCounts = [
        'bukidnon' => Tupad::whereRaw('LOWER(pfo) = ?', ['bukidnon'])->count(),
        'ldn' => Tupad::whereRaw('LOWER(pfo) = ?', ['ldn'])->count(),
        'camiguin' => Tupad::whereRaw('LOWER(pfo) = ?', ['camiguin'])->count(),
        'misoc' => Tupad::whereRaw('LOWER(pfo) = ?', ['misoc'])->count(),
        'misor' => Tupad::whereRaw('LOWER(pfo) = ?', ['misor'])->count(),
    ];

    return response()->json([
        'pfo_counts' => $pfoCounts,
        'data' => $tupads->map(function ($tupad) {
            return [
                'id' => $tupad->id,
                'seriesNo' => $tupad->series_no,
                'adlNo' => $tupad->adl_no,
                'project_title' => $tupad->project_title,
                'pfo' => $tupad->pfo,
                'beneficiaries' => $tupad->beneficiaries,
                'actual' => $tupad->actual,
                'status' => $tupad->status,
                'budget' => $tupad->budget,
                'voucher_amount' => $tupad->voucher_amount,
                'commited_date' => $tupad->commited_date,
                'commited_date_received' => $tupad->commited_date_received,
                'commited_status' => $tupad->commited_status,
                'history' => $tupad->history->map(function ($history) {
                    return [
                        'dateReceived' => $history->date_received,
                        'duration' => $history->duration . ' months',
                        'location' => $history->location,
                        'budget' => $history->budget,
                        'voucher_amount' => $history->voucher_amount,
                        'moi' => $history->moi,
                    ];
                }),
            ];
        })
    ]);
}





public function storeOrUpdate(Request $request, $id = null)
{
    $validatedData = $request->validate([
        'adl_no' => 'nullable|array',
        'pfo' => 'nullable|string|max:255',
        'status' => 'nullable|string|max:255',
        'date_received' => 'nullable|date',
        'duration' => 'nullable|integer',
        'location' => 'nullable|string|max:255',
        'budget' => 'nullable|numeric|min:0',
        'project_title' => 'nullable|string|max:255',
        'moi' => 'nullable|string|max:255',
        'beneficiaries' => 'nullable|integer',
        'actual' => 'nullable|numeric',
        'receiver' => 'nullable|string|max:255',
        'poi' => 'nullable|string|max:255',
        'district' => 'nullable|string|max:255',
        'cut_off' => 'nullable|string|max:255',
        'amount' => 'nullable|numeric|min:0',
        'change_amount' => 'nullable|numeric|min:0',
        'date_received_payroll' => 'nullable|date',
        'receiver_payroll' => 'nullable|string|max:255',
    ]);

    if ($id) {
        $tupad = Tupad::findOrFail($id);

        $budget = $validatedData['budget'] ?? $tupad->budget;
        $amount = $validatedData['amount'] ?? $tupad->amount;
        $changeAmount = array_key_exists('change_amount', $validatedData)
            ? $validatedData['change_amount']
            : $tupad->change_amount;

        $validatedData['obligated_amount'] = $changeAmount !== null
            ? $budget - $changeAmount
            : $budget - $amount;

        $tupad->update($validatedData);

        return response()->json([
            'message' => 'Tupad record updated successfully!',
            'data' => $tupad,
        ]);
    } else {
        $budget = $validatedData['budget'] ?? 0;
        $amount = $validatedData['amount'] ?? 0;
        $changeAmount = $validatedData['change_amount'] ?? null;

        $validatedData['obligated_amount'] = $changeAmount !== null
            ? $budget - $changeAmount
            : $budget - $amount;

        $tupad = Tupad::create($validatedData);

        return response()->json([
            'message' => 'Tupad record created successfully!',
            'data' => $tupad,
        ], 201);
    }
}


public function getAll()
{
    $tupadRecords = Tupad::leftJoin('tupad_papers', 'tupads.id', '=', 'tupad_papers.tupad_id')
        ->select(
            'tupads.*', // Select all columns from tupads
            'tupad_papers.payment_status' // Include payment_status
        )
        ->get();

    return response()->json([
        'data' => $tupadRecords,
    ]);
}



    public function getLatestSeriesNo($pfo)
{
    $latestSeries = Tupad::where('pfo', $pfo)->max('series_no'); // Get highest series_no
    $latestSeriesNumber = $latestSeries ? intval(substr($latestSeries, -3)) : 0; // Extract last 3 digits
    return response()->json(['latestSeriesNo' => $latestSeriesNumber]);
}


public function show($id)
{
    $tupad = Tupad::with('history')->find($id);

    if (!$tupad) {
        return response()->json(['message' => 'Tupad record not found'], 404);
    }

    return response()->json($tupad);
}

public function update(Request $request, $id)
{
    $tupad = Tupad::find($id);

    if (!$tupad) {
        return response()->json(['message' => 'Tupad record not found'], 404);
    }

    $request->validate([
        'adl_no' => 'required|array',
        'pfo' => 'required|string|max:255',
        'status' => 'required|string|max:255',
        'date_received' => 'required|date',
        'duration' => 'required|integer',
        'location' => 'required|string|max:255',
        'budget' => 'required|numeric|min:0',
        'project_title' => 'required|string|max:255',
        'moi' => 'required|string|max:255',
        'beneficiaries' => 'required|integer',
        'actual' => 'required|numeric',
        'poi' => 'required|string|max:255',
        'receiver' => 'required|string|max:255',
        'district' => 'required|string|max:255',
        'cut_off' => 'nullable|string|max:255',
        'amount' => 'nullable|numeric|min:0',
        'change_amount' => 'nullable|numeric|min:0',
        'obligated_amount' => 'nullable|numeric|min:0',
        'date_received_payroll' => 'required|date',
        'receiver_payroll' => 'required|string|max:255',



    ]);

    $tupad->update($request->all());

    return response()->json([
        'message' => 'Tupad record updated successfully!',
        'data' => $tupad,
    ]);
}

public function getTupadDetails($id)
{
    $tupad = Tupad::leftJoin('tupad_papers', 'tupads.id', '=', 'tupad_papers.tupad_id')
        ->where('tupads.id', $id)
        ->select(
            'tupads.id',
            'tupads.status',
            'tupads.commited_status',
            'tupad_papers.payment_status'
        )
        ->first();

    if (!$tupad) {
        return response()->json(['message' => 'TUPAD record not found'], 404);
    }

    return response()->json($tupad);
}




}

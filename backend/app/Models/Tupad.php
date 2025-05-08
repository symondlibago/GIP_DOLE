<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tupad extends Model
{
    use HasFactory;

    protected $fillable = [
        'adl_no',
        'project_title',
        'moi',
        'beneficiaries',
        'actual',
        'pfo',
        'status',
        'date_received',
        'duration',
        'location',
        'receiver',
        'district',
        'poi',
        'budget',
        'cut_off',
        'amount',
        'change_amount',
        'obligated_amount',
        'date_received_payroll',
        'receiver_payroll',
    ];

    protected $casts = [
        'adl_no' => 'array', // Convert JSON to an array automatically
    ];

    public function history()
    {
        return $this->hasMany(TupadsPaper::class, 'tupad_id');
    }
    public function paper()
{
    return $this->hasOne(TupadPaper::class, 'tupad_id');
}

    
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TupadPaper extends Model
{
    use HasFactory;

    protected $fillable = [
        'tupad_id',
        'tssd',
        'budget',
        'imsd_chief',
        'ard',
        'rd',
        'process',
        'budget_accounting',
        'accounting',
        'payment_status',
    ];

    public function tupad()
    {
        return $this->belongsTo(Tupad::class, 'tupad_id');
    }
    

}
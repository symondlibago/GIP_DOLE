<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdlPaper extends Model
{
    use HasFactory;

    protected $fillable = [
        'tupad_id',
        'budget',
        'r_budget',
        'rt_budget',
        'tssd',
        'r_tssd',
        'accounting',
        'r_accounting',
    ];

    public function tupad()
    {
        return $this->belongsTo(Tupad::class, 'tupad_id');
    }
    

}
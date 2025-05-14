<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GipPaper extends Model
{
    use HasFactory;

    protected $fillable = [
        'tupad_id',
        'budget',
        'r_budget',
        'tssd',
        'r_tssd',
        'rd',
        'r_rd',
    ];

    public function tupad()
    {
        return $this->belongsTo(Tupad::class, 'tupad_id');
    }
    

}
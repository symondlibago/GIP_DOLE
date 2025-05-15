<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Names extends Model
{
    use HasFactory;

    protected $fillable = [
        'tupad_id',
        'tssd',
        'r_tssd',
        'name',
    ];

    protected $casts = [
        'name' => 'array', 
    ];

    public function tupad()
    {
        return $this->belongsTo(Tupad::class, 'tupad_id');
    }
    

}
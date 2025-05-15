<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('names', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tupad_id')->constrained('tupads')->onDelete('cascade'); // Foreign key fix
            $table->date('tssd')->nullable();
            $table->date('r_tssd')->nullable();
            $table->json('name')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('names');
    }
};
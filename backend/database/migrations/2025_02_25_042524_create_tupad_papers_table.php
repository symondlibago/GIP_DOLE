<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tupad_papers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tupad_id')->constrained('tupads')->onDelete('cascade'); // Foreign key fix
            $table->date('tssd')->nullable();
            $table->date('budget')->nullable(); // Changed from dateTime to date
            $table->date('imsd_chief')->nullable();
            $table->date('ard')->nullable();
            $table->date('rd')->nullable();
            $table->date('process')->nullable();
            $table->date('budget_accounting')->nullable();
            $table->date('accounting')->nullable();
            $table->string('payment_status');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tupad_papers');
    }
};
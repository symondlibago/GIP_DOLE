<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTupadsTable extends Migration
{
    public function up()
    {
        Schema::create('tupads', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->json('adl_no')->nullable(); // Change from string to JSON
            $table->string('pfo');
            $table->string('project_title');
            $table->integer('beneficiaries');
            $table->float('actual');
            $table->string('status');
            $table->string('moi');
            $table->date('date_received'); // Field for received date
            $table->string('receiver'); // Field for receiver
            $table->string('district'); // Field for district
            $table->string('poi'); // Field for poi
            $table->integer('duration'); // Field for duration in days
            $table->string('location'); // Field for location
            $table->string('cut_off')->nullable(); // Field for location
            $table->decimal('amount')->nullable();
            $table->decimal('change_amount')->nullable();
            $table->decimal('obligated_amount')->nullable();
            $table->decimal('budget', 15, 2); // Numerical budget with precision
            $table->date('date_received_payroll')->nullable(); // Field for received date
            $table->string('receiver_payroll')->nullable(); // Field for receiver
            $table->timestamps(); // Created_at and Updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('tupads');
    }
}

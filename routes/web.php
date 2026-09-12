<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'home')->name('home');
Route::view('/editor', 'editor')->name('editor');

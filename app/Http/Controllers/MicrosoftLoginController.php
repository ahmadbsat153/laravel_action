<?php

namespace App\Http\Controllers;
use Laravel\Socialite\Facades\Socialite;

use Illuminate\Http\Request;

class MicrosoftLoginController extends Controller
{
    //
    public function handleCallback()
{
    $user = Socialite::driver('azure')->user();
    // Handle user authentication or registration here
    
    return redirect('/home'); // Redirect after login
}
}

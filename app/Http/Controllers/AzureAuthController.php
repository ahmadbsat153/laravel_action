<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class AzureAuthController extends Controller
{
    public function handleCallback(Request $request)
    {
        try {
            $socialiteUser = Socialite::driver('azure')->user();
            $user = User::where('email', $socialiteUser->getEmail())->first();

            if ($user) {
                // User exists, log them in
                Auth::login($user);
            } else {
                // User doesn't exist, create a new user
                $user = new User();
                $user->name = $socialiteUser->getName();
                $user->email = $socialiteUser->getEmail();
                $user->save();

                // Log the user in
                Auth::login($user);
            }

        } catch (\Exception $e) {
            return redirect('/Main');
        }

        // Do something with the user data (e.g. save to database)

        return redirect('/Main');
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Cookie;
use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Manager\OAuth2\User as SocialiteUser;
use Illuminate\Support\Facades\Http;

class AzureAuthController extends Controller
{

    public function handleCallback(Request $request)
    {
        
        $UserId = $request->query('UserId');
        $Type_id = $request->query('TypeId');


        $response = Http::post('http://192.100.108.13:8080/api/GTAM/UserInfo', [
            'UserId' => $UserId,
            'Type_id' => $Type_id,
        ]);
        
        if ($response->ok()) {
            // $user = $response->json();
            // Process the user data
        } else {
            // Handle the error
        }

        try {
            $socialiteUser = Socialite::driver('azure')->user();
           
            // session()->put('socialiteUser', $socialiteUser);
            $user = User::where('email', $socialiteUser->getEmail())->first();

            session()->put('userr', $socialiteUser);
            // $value = session()->get('userr');
            // dd($value);

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
            $serializedUser = serialize($socialiteUser);
            $cookie = Cookie::make('socialiteUser', $serializedUser, 60); // expires in 60 minutes
            return redirect('/Main');
        } catch (\Exception $e) {
            return redirect('/Main');
        }
    
        // Do something with the user data (e.g. save to database)
        return redirect('/Main');
    }
}
<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LayoutController;
use App\Http\Controllers\SupportFormController;
use App\Http\Controllers\Auth\FileController;
use App\Http\Controllers\SendDailyEmail;
use Illuminate\Http\Request;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ContactUsFormController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AzureAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Azure\AzureProvider;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/gtms', function () {
    return Inertia::render('GTMS');
})->middleware(['auth', 'verified'])->name('gtms');

Route::get('/gtam', function () {
    return Inertia::render('GTAM');
})->middleware(['auth', 'verified'])->name('gtam');

Route::get('/gtrs', function () {
    return Inertia::render('GTRS');
})->middleware(['auth', 'verified'])->name('gtrs');

Route::get('/gtw', function () {
    return Inertia::render('GTW');
})->middleware(['auth', 'verified'])->name('gtw');

Route::get('/Main', function () {
    return Inertia::render('Layout');
})->middleware(['auth', 'verified'])->name('layout');

Route::get('/opportunities', function () {
    return Inertia::render('Opportunities');
})-> name('opportunities');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})-> name('terms');

Route::get('/capabilitystatement', function () {
    return Inertia::render('Capability');
})-> name('capabilitystatement');

Route::get('/palletterms', function () {
    return Inertia::render('PalletTerms');
})-> name('palletterms');
// Route::get('/news', function () {
//     return Inertia::render('NewsPage');
// })-> name('news');

Route::get('/news/{id}', function ($id) {
    return Inertia::render('NewsPage', ['id' => $id]);
})->name('news');

Route::post('/contact', [ContactFormController::class, 'submitContactForm'])->name('contact.submit');
Route::post('/contactus', [ContactUsFormController::class, 'submitContactUsForm'])->name('contactus.submit');

Route::get('/download-docx', function() {
    $pathToFile = public_path('docs/202201223-Gold-Tiger-Logistics-Solutions-Trading-Terms-and-Conditions-1.docx');
    $headers = array(
        'Content-Type: application/docx',
    );
    return response()->download($pathToFile, '202201223-Gold-Tiger-Logistics-Solutions-Trading-Terms-and-Conditions-1.docx', $headers);
});
Route::get('/auth/azure', function () {
    return Socialite::driver('azure')->redirect();
});
Route::get('/downloadGTLS-docx', function() {
    $pathToFile = public_path('docs/Gold-Tiger-Capability-Statement-2020-12-24.docx');
    $headers = array(
        'Content-Type: application/docx',
    );
    return response()->download($pathToFile, 'Gold-Tiger-Capability-Statement-2020-12-24.docx', $headers);
});

Route::get('/checkAuth', [AuthenticatedSessionController::class, 'checkAuth']);
Route::get('/auth/azure/callback', [AzureAuthController::class, 'handleCallback']);


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/users', [RegisteredUserController::class, 'getCurrentUserName'])->name('/gtms');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/user/{id}', [RegisteredUserController::class, 'getUserName']);

});

require __DIR__.'/auth.php';
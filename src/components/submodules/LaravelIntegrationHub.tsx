import React, { useState } from 'react';
import { 
  Code, 
  Server, 
  Database, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Key, 
  Send, 
  Cpu, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LaravelIntegrationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'sandbox' | 'schema' | 'devops'>('code');
  const [selectedFile, setSelectedFile] = useState<string>('routes/api.php');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);

  // REST API Sandbox State
  const [apiEndpoint, setApiEndpoint] = useState<string>('POST /api/v1/auth/login');
  const [sanctumToken, setSanctumToken] = useState<string>('1|sanctum_p3x_98412039841029384910238');
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify({ email: 'operator@holidaytravelers.ph', password: 'secretpassword' }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);

  const fileContents: Record<string, { label: string; lang: string; code: string }> = {
    'database/seeders/UserSeeder.php': {
      label: 'Staff RBAC Database Seeder (database/seeders/UserSeeder.php)',
      lang: 'php',
      code: `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the 4 official Holiday Travelers staff accounts with roles and passwords.
     * Run with: php artisan db:seed --class=UserSeeder
     */
    public function run(): void
    {
        $staffMembers = [
            [
                'name' => 'Karll Jacob',
                'email' => 'karlljacob8@gmail.com',
                'role' => 'Super Admin',
                'password' => Hash::make('admin12345'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Kyle Dulay',
                'email' => 'dulaykyle15@gmail.com',
                'role' => 'Tour Operations Manager',
                'password' => Hash::make('admin12345'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ilona May Ambe',
                'email' => 'ambeilonamay67@gmail.com',
                'role' => 'Finance Officer',
                'password' => Hash::make('admin12345'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Michael Baynosa',
                'email' => 'michaelbaynosa01@gmail.com',
                'role' => 'Tour Guide',
                'password' => Hash::make('admin12345'),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($staffMembers as $staff) {
            User::updateOrCreate(
                ['email' => $staff['email']],
                $staff
            );
        }
    }
}`
    },
    'app/Http/Controllers/AuthController.php': {
      label: 'Production Auth Controller (app/Http/Controllers/AuthController.php)',
      lang: 'php',
      code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use App\\Mail\\AdminOtpMail;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Facades\\Mail;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Support\\Facades\\RateLimiter;
use Illuminate\\Support\\Facades\\Schema;
use Illuminate\\Support\\Str;

class AuthController extends Controller
{
    /**
     * Step 1: Validate operator credentials and dispatch 6-digit OTP to email
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $email = Str::lower(trim($request->email));
        $throttleKey = 'login-attempt:' . $email . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'status' => 'error',
                'message' => "Too many failed attempts. Account throttled for {$seconds} seconds."
            ], 429);
        }

        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey, 900);
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password.'
            ], 401);
        }

        RateLimiter::clear($throttleKey);

        // Generate cryptographically secure 6-digit OTP
        $plainOtp = sprintf("%06d", random_int(100000, 999999));

        // Store OTP in database if columns exist, otherwise use Cache
        $this->storeOtpSession($user, $email, $plainOtp);

        // Dispatch Email via SMTP (AdminOtpMail with Mail::raw fallback)
        $this->dispatchEmailOtp($user->email, $plainOtp, $request->ip() ?? '127.0.0.1', $user);

        return response()->json([
            'status' => 'otp_dispatched',
            'message' => 'A 6-digit verification code has been dispatched to your authorized email address.',
            'target_email' => $user->email,
        ]);
    }

    /**
     * Alias for admin-login endpoint
     */
    public function adminLogin(Request $request)
    {
        return $this->login($request);
    }

    /**
     * Resend / Send 6-digit OTP
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = Str::lower(trim($request->email));
        $throttleKey = 'resend-otp:' . $email . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 4)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'status' => 'error',
                'message' => "Too many resend attempts. Please wait {$seconds} seconds."
            ], 429);
        }

        RateLimiter::hit($throttleKey, 60);

        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authorized operator account not found.'
            ], 404);
        }

        $plainOtp = sprintf("%06d", random_int(100000, 999999));
        $this->storeOtpSession($user, $email, $plainOtp);
        $this->dispatchEmailOtp($user->email, $plainOtp, $request->ip() ?? '127.0.0.1', $user);

        return response()->json([
            'status' => 'success',
            'message' => 'Fresh 6-digit authorization code dispatched to registered mailbox.'
        ]);
    }

    /**
     * Step 2: Validate 6-digit OTP and issue authenticated Sanctum token
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $candidateCode = trim((string) ($request->otp ?? $request->code ?? ''));

        if (strlen($candidateCode) !== 6 || !ctype_digit($candidateCode)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The verification code must be exactly 6 numeric digits.'
            ], 422);
        }

        $email = Str::lower(trim($request->email));
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Operator account not found.'
            ], 404);
        }

        // 1. Check Database Storage (if columns exist)
        $hasDbColumns = Schema::hasColumn('users', 'two_factor_hash');

        if ($hasDbColumns && $user->two_factor_expires_at) {
            if (now()->isAfter($user->two_factor_expires_at)) {
                $user->forceFill(['two_factor_hash' => null, 'two_factor_expires_at' => null])->save();
                return response()->json(['status' => 'error', 'message' => 'Verification code expired. Please request a new code.'], 422);
            }

            if (($user->two_factor_attempts ?? 0) >= 3) {
                $user->forceFill(['two_factor_hash' => null, 'two_factor_expires_at' => null, 'two_factor_attempts' => 0])->save();
                return response()->json(['status' => 'error', 'message' => 'Maximum OTP attempts exceeded. Code has been invalidated.'], 422);
            }

            if (!Hash::check($candidateCode, $user->two_factor_hash)) {
                $user->increment('two_factor_attempts');
                $remaining = 3 - ($user->two_factor_attempts ?? 1);
                return response()->json([
                    'status' => 'error',
                    'message' => "Invalid verification code. ({$remaining} attempt(s) remaining)"
                ], 422);
            }

            // Invalidate OTP immediately upon success
            $user->forceFill([
                'two_factor_hash' => null,
                'two_factor_expires_at' => null,
                'two_factor_attempts' => 0,
            ])->save();
        } else {
            // 2. Cache Fallback check
            $cachedHash = Cache::get("otp_hash_{$email}");
            if (!$cachedHash) {
                return response()->json(['status' => 'error', 'message' => 'No active OTP session found or code expired. Please request a new code.'], 422);
            }

            if (!Hash::check($candidateCode, $cachedHash)) {
                return response()->json(['status' => 'error', 'message' => 'Invalid 6-digit verification code.'], 422);
            }

            Cache::forget("otp_hash_{$email}");
        }

        // Issue token (Sanctum or safe random string fallback)
        $token = method_exists($user, 'createToken')
            ? $user->createToken('admin-command-token', [$user->role ?? 'Tour Guide'])->plainTextToken
            : bin2hex(random_bytes(32));

        return response()->json([
            'status' => 'authenticated',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'Tour Guide',
            ]
        ]);
    }

    /**
     * Helper: Store OTP in DB or Cache
     */
    protected function storeOtpSession($user, string $email, string $plainOtp): void
    {
        try {
            if (Schema::hasColumn('users', 'two_factor_hash')) {
                $user->forceFill([
                    'two_factor_hash' => Hash::make($plainOtp),
                    'two_factor_expires_at' => now()->addMinutes(10),
                    'two_factor_attempts' => 0,
                ])->save();
                return;
            }
        } catch (\\Exception $e) {
            \\Log::warning("Could not write OTP to users table: " . $e->getMessage());
        }

        Cache::put("otp_hash_{$email}", Hash::make($plainOtp), now()->addMinutes(10));
    }

    /**
     * Helper: Send SMTP Email with Mailable or Raw Fallback
     */
    protected function dispatchEmailOtp(string $recipientEmail, string $plainOtp, string $ip, $user = null): void
    {
        $roleName = $user->role ?? 'Authorized Staff';
        $userName = $user->name ?? 'Staff';

        try {
            if (class_exists(AdminOtpMail::class)) {
                Mail::to($recipientEmail)->send(new AdminOtpMail($plainOtp, $ip));
                return;
            }
        } catch (\\Throwable $e) {
            \\Log::warning('AdminOtpMail Mailable failed, using raw fallback: ' . $e->getMessage());
        }

        Mail::raw(
            "Hello {$userName},\n\n" .
            "Your single-use 6-digit authorization code for the Holiday Travelers Operations Terminal is:\n\n" .
            "        {$plainOtp}\n\n" .
            "Clearance Role: {$roleName}\n" .
            "This verification code expires in 10 minutes.\n" .
            "Request origin IP: {$ip}\n\n" .
            "If you did not initiate this authorization, please notify the security team immediately.\n\n" .
            "— Holiday Travelers Security Team",
            function ($message) use ($recipientEmail, $plainOtp) {
                $message->to($recipientEmail)
                        ->subject("[HTTT-SEC] Operations Access Code: {$plainOtp}");
            }
        );
    }
}`
    },
    'routes/api.php': {
      label: 'REST API Routes (routes/api.php)',
      lang: 'php',
      code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\Api\\BookingController;

// Public 2FA Authentication Endpoints
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/admin-login', [AuthController::class, 'login']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/resend-otp', [AuthController::class, 'sendOtp']);
});

// Protected Endpoints - Laravel Sanctum Auth Guard
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus']);
});`
    },
    'BookingController.php': {
      label: 'Booking API Controller (BookingController.php)',
      lang: 'php',
      code: `<?php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use App\\Models\\Booking;
use App\\Models\\Invoice;
use Illuminate\\Support\\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_package_id' => 'required|string',
            'tour_title' => 'required|string',
            'customer' => 'required|array',
            'passengers' => 'required|array|min:1',
            'travel_date' => 'required|date',
            'num_pax' => 'required|integer',
            'total_price' => 'required|numeric'
        ]);

        $bookingRef = 'TT-' . date('Y') . '-' . rand(1000, 9999);

        $booking = Booking::create([
            'id' => (string) Str::uuid(),
            'booking_ref' => $bookingRef,
            'tour_package_id' => $validated['tour_package_id'],
            'tour_title' => $validated['tour_title'],
            'customer' => $validated['customer'],
            'passengers' => $validated['passengers'],
            'travel_date' => $validated['travel_date'],
            'num_pax' => $validated['num_pax'],
            'total_price' => $validated['total_price'],
            'booking_status' => 'Confirmed'
        ]);

        return response()->json(['status' => 'success', 'booking_ref' => $bookingRef, 'data' => $booking], 201);
    }
}`
    },
    'app.blade.php': {
      label: 'Blade Master Layout (resources/views/layouts/app.blade.php)',
      lang: 'html',
      code: `<!DOCTYPE html>
<html lang="en" class="h-full bg-[#070B0E]">
<head>
    <meta charset="UTF-8">
    <title>Holiday Travelers Travel and Tours Inc — Laravel + Blade</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-[#070B0E] text-[#F3EFE0] flex flex-col min-h-screen">
    <nav class="bg-[#0B1014] border-b border-white/10 p-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2">
                <i data-lucide="compass" class="text-[#F26A4F]"></i>
                <span class="font-serif text-lg text-white">Holiday Travelers</span>
            </div>
            <div class="text-xs text-sand-muted">Sanctum Auth Active</div>
        </div>
    </nav>
    <main class="flex-1 max-w-7xl w-full mx-auto p-6">
        @yield('content')
    </main>
</body>
</html>`
    },
    'create_bookings_table.php': {
      label: 'PostgreSQL Migration (create_bookings_table.php)',
      lang: 'php',
      code: `<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('booking_ref')->unique();
            $table->uuid('tour_package_id')->index();
            $table->string('tour_title');
            $table->jsonb('customer'); // PostgreSQL JSONB column
            $table->jsonb('passengers');
            $table->date('travel_date');
            $table->integer('num_pax');
            $table->decimal('total_price', 12, 2);
            $table->string('booking_status')->default('Confirmed');
            $table->timestamps();
        });
    }
};`
    },
    'deploy.yml': {
      label: 'GitHub Actions CI/CD (.github/workflows/deploy.yml)',
      lang: 'yaml',
      code: `name: Laravel CI/CD Pipeline
on: [push, pull_request]
jobs:
  laravel-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: holidaytravelers_db
          POSTGRES_PASSWORD: secretpassword
        ports: [5432:5432]
    steps:
      - uses: actions/checkout@v3
      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.2', extensions: 'pdo, pdo_pgsql' }
      - run: composer install
      - run: php artisan migrate --force
      - run: vendor/bin/phpunit`
    },
    'render.yaml': {
      label: 'Render Deployment Blueprint (render.yaml)',
      lang: 'yaml',
      code: `services:
  - type: web
    name: holidaytravelers-laravel-api
    env: docker
    plan: free
    region: singapore
    envVars:
      - key: APP_ENV
        value: production
      - key: DB_CONNECTION
        value: pgsql
      - key: DB_HOST
        fromDatabase: { name: holidaytravelers-postgres, property: host }

  - type: postgres
    name: holidaytravelers-postgres
    plan: free
    databaseName: holidaytravelers_capstone`
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileContents[selectedFile].code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleRunApiTest = () => {
    setIsLoadingApi(true);
    setTimeout(() => {
      if (apiEndpoint.includes('login')) {
        setApiResponse({
          status: 'success',
          access_token: sanctumToken,
          token_type: 'Bearer',
          user: {
            id: 'usr-001',
            name: 'Operations Manager',
            email: 'operator@holidaytravelers.ph',
            role: 'Lead Dispatcher'
          }
        });
      } else {
        setApiResponse({
          status: 'success',
          booking_ref: 'TT-2026-9812',
          message: 'PostgreSQL transaction committed via Laravel Eloquent ORM.'
        });
      }
      setIsLoadingApi(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sunset-coral text-xs font-sans-body tracking-[0.25em] uppercase font-medium">
              <Server className="w-4 h-4" />
              <span>Integration Architecture Hub</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-light text-ivory tracking-wide">
              Laravel + Sanctum + PostgreSQL Stack
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed">
              Inspect PHP controllers, Blade layouts, PostgreSQL migration scripts, Sanctum Bearer tokens, GitHub Actions CI/CD, and Render deployment templates.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-4 py-2 rounded-full bg-[#070B0E] border border-sunset-coral/30 text-sunset-coral font-mono text-xs font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Sanctum REST API
            </span>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/[0.08] text-xs">
          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-white/[0.04]">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted block font-sans-body">Frontend</span>
            <div className="text-ivory font-medium mt-1">Laravel Blade + Tailwind</div>
          </div>

          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-white/[0.04]">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted block font-sans-body">Backend & Auth</span>
            <div className="text-ivory font-medium mt-1">PHP 8.2 + Sanctum</div>
          </div>

          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-white/[0.04]">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted block font-sans-body">Database</span>
            <div className="text-ivory font-medium mt-1">PostgreSQL (JSONB)</div>
          </div>

          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-white/[0.04]">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted block font-sans-body">CI/CD & Cloud</span>
            <div className="text-ivory font-medium mt-1">GitHub Actions + Render</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-sans-body">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-full tracking-wider transition ${
            activeTab === 'code'
              ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
              : 'bg-white/[0.04] text-sand-muted hover:text-ivory'
          }`}
        >
          Source Code Explorer
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2 rounded-full tracking-wider transition ${
            activeTab === 'sandbox'
              ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
              : 'bg-white/[0.04] text-sand-muted hover:text-ivory'
          }`}
        >
          REST API Sandbox
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-full tracking-wider transition ${
            activeTab === 'schema'
              ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
              : 'bg-white/[0.04] text-sand-muted hover:text-ivory'
          }`}
        >
          PostgreSQL DB Schema
        </button>

        <button
          onClick={() => setActiveTab('devops')}
          className={`px-4 py-2 rounded-full tracking-wider transition ${
            activeTab === 'devops'
              ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
              : 'bg-white/[0.04] text-sand-muted hover:text-ivory'
          }`}
        >
          CI/CD & Render Deploy
        </button>
      </div>

      {/* TAB 1: CODE EXPLORER */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* File Tree Sidebar */}
          <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-4 space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-sand-muted block mb-3 font-sans-body">
              Project File Tree
            </span>
            {Object.keys(fileContents).map((fileKey) => (
              <button
                key={fileKey}
                onClick={() => setSelectedFile(fileKey)}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-mono text-xs transition flex items-center justify-between ${
                  selectedFile === fileKey
                    ? 'bg-sunset-coral/15 text-sunset-coral border border-sunset-coral/30 font-bold'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-sand-muted" />
                  <span className="truncate">{fileKey}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-3 bg-[#070B0E] border border-white/[0.06] rounded-2xl p-5 space-y-3 relative shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="font-mono text-xs text-sunset-coral font-bold">
                {fileContents[selectedFile].label}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-ivory text-xs rounded-full border border-white/10 transition"
              >
                {copiedFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-sand-muted" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            <pre className="overflow-x-auto text-xs font-mono text-ivory/90 leading-relaxed max-h-[500px] p-2">
              <code>{fileContents[selectedFile].code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: REST API SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-serif-display text-xl text-ivory">API Request Builder</h3>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sand-muted mb-1 font-sans-body">Endpoint</label>
              <select
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-ivory font-mono focus:outline-none focus:border-sunset-coral"
              >
                <option value="POST /api/v1/auth/login">POST /api/v1/auth/login (Acquire Sanctum Token)</option>
                <option value="POST /api/v1/bookings">POST /api/v1/bookings (Create Booking Manifest)</option>
                <option value="GET /api/v1/bookings">GET /api/v1/bookings (List All Bookings)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sand-muted mb-1 font-sans-body">Bearer Token</label>
              <input
                type="text"
                value={sanctumToken}
                onChange={(e) => setSanctumToken(e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-sand-muted font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sand-muted mb-1 font-sans-body">Request JSON Payload</label>
              <textarea
                rows={5}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl p-3 text-xs text-ivory font-mono focus:outline-none focus:border-sunset-coral"
              />
            </div>

            <button
              onClick={handleRunApiTest}
              disabled={isLoadingApi}
              className="w-full py-2.5 bg-sunset-coral hover:bg-[#D95339] text-white font-medium text-xs rounded-full shadow-lg shadow-sunset-coral/20 transition flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isLoadingApi ? 'Executing Request...' : 'Send API Test Request'}</span>
            </button>
          </div>

          <div className="bg-[#070B0E] border border-white/[0.06] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-serif-display text-xl text-ivory">API JSON Response</h3>
            <div className="bg-[#0B1014] border border-white/[0.04] p-4 rounded-xl max-h-[350px] overflow-y-auto">
              <pre className="text-xs font-mono text-emerald-400">
                {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// Response will appear here after execution...'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEMA */}
      {activeTab === 'schema' && (
        <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="font-serif-display text-2xl text-ivory">PostgreSQL Relational Schema Specification</h3>
          <p className="text-xs text-sand-muted font-light leading-relaxed">
            All tables are architected with native UUID primary keys, JSONB columns for flexible passenger manifests, and foreign key indexes for lightning-fast queries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.04] space-y-2">
              <span className="text-xs font-mono text-sunset-coral font-bold block">1. bookings (Table)</span>
              <ul className="text-xs text-sand-muted space-y-1 font-mono font-light">
                <li>• id (UUID, PK)</li>
                <li>• booking_ref (VARCHAR, Unique)</li>
                <li>• customer (JSONB)</li>
                <li>• passengers (JSONB)</li>
                <li>• total_price (DECIMAL)</li>
                <li>• booking_status (VARCHAR)</li>
              </ul>
            </div>

            <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.04] space-y-2">
              <span className="text-xs font-mono text-sunset-coral font-bold block">2. invoices (Table)</span>
              <ul className="text-xs text-sand-muted space-y-1 font-mono font-light">
                <li>• id (UUID, PK)</li>
                <li>• booking_id (UUID, FK)</li>
                <li>• total_amount (DECIMAL)</li>
                <li>• amount_paid (DECIMAL)</li>
                <li>• balance_due (DECIMAL)</li>
                <li>• payment_status (VARCHAR)</li>
              </ul>
            </div>

            <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.04] space-y-2">
              <span className="text-xs font-mono text-sunset-coral font-bold block">3. tour_packages (Table)</span>
              <ul className="text-xs text-sand-muted space-y-1 font-mono font-light">
                <li>• id (UUID, PK)</li>
                <li>• code (VARCHAR, Unique)</li>
                <li>• title (VARCHAR)</li>
                <li>• price_per_pax (DECIMAL)</li>
                <li>• inclusions (JSONB)</li>
                <li>• itinerary (JSONB)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEVOPS */}
      {activeTab === 'devops' && (
        <div className="bg-[#0B1014] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-serif-display text-2xl text-ivory">CI/CD Pipeline & Cloud Deployment Setup</h3>
            <p className="text-xs text-sand-muted font-light leading-relaxed">
              Step-by-step blueprint to connect your GitHub repository to automated testing and deploy seamlessly to Render Cloud or Railway.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.04] space-y-2">
              <span className="text-xs font-sans-body uppercase tracking-wider text-sunset-coral font-medium">Step 1: Increase Composer Timeout (Local Machine)</span>
              <p className="text-xs text-sand-muted font-light">
                Run <code className="text-sunset-coral font-mono">composer config --global process-timeout 2000</code> to prevent slow Git checkout timeouts.
              </p>
            </div>

            <div className="bg-[#070B0E] p-4 rounded-xl border border-white/[0.04] space-y-2">
              <span className="text-xs font-sans-body uppercase tracking-wider text-sunset-coral font-medium">Step 2: Database Migration</span>
              <p className="text-xs text-sand-muted font-light">
                Run <code className="text-sunset-coral font-mono">php artisan migrate --seed</code> to bootstrap the tour packages and test operator account.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

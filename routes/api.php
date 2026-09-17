<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\SsgController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        Route::get('/students', [AdminController::class, 'students']);
        Route::post('/students', [AdminController::class, 'storeStudent']);
        Route::put('/students/{student}', [AdminController::class, 'updateStudent']);
        Route::delete('/students/{student}', [AdminController::class, 'destroyStudent']);

        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'storeUser']);
        Route::put('/users/{user}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser']);
        Route::post('/users/{user}/reset-password', [AdminController::class, 'resetPassword']);

        Route::get('/grades', [AdminController::class, 'grades']);
        Route::get('/payments', [AdminController::class, 'payments']);

        Route::get('/events', [AdminController::class, 'events']);
        Route::get('/events/{event}/attendance', [AdminController::class, 'eventAttendance']);

        Route::get('/reports/{type}', [AdminController::class, 'report']);
    });

    Route::middleware('role:teacher')->prefix('teacher')->group(function () {
        Route::get('/students', [TeacherController::class, 'students']);
        Route::get('/grades', [TeacherController::class, 'grades']);
        Route::post('/grades/bulk', [TeacherController::class, 'bulkGrades']);
        Route::get('/grades/pdf', [TeacherController::class, 'gradesPdf']);
        Route::get('/schedule', [TeacherController::class, 'schedule']);
    });

    Route::middleware('role:finance')->prefix('finance')->group(function () {
        Route::get('/students', [FinanceController::class, 'students']);
        Route::get('/students/{student}/payments', [FinanceController::class, 'payments']);
        Route::post('/students/{student}/payments', [FinanceController::class, 'storePayment']);
        Route::get('/students/{student}/billing-pdf', [FinanceController::class, 'billingPdf']);
    });

    Route::middleware('role:ssg')->prefix('ssg')->group(function () {
        Route::get('/events', [SsgController::class, 'events']);
        Route::post('/events', [SsgController::class, 'storeEvent']);
        Route::delete('/events/{event}', [SsgController::class, 'destroyEvent']);
        Route::post('/attendance/scan', [SsgController::class, 'scan']);
        Route::get('/attendance', [SsgController::class, 'attendance']);
    });

    Route::middleware('role:student,parent')->prefix('student')->group(function () {
        Route::get('/overview', [StudentController::class, 'overview']);
        Route::get('/grades', [StudentController::class, 'grades']);
        Route::get('/schedule', [StudentController::class, 'schedule']);
        Route::get('/payments', [StudentController::class, 'payments']);
        Route::get('/qr', [StudentController::class, 'qr']);
        Route::get('/events', [StudentController::class, 'events']);
    });
});

<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Schedule;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    private function resolveStudent(Request $request): ?Student
    {
        return $request->user()->student;
    }

    public function overview(Request $request)
    {
        $student = $this->resolveStudent($request);

        if (! $student) {
            return response()->json(['message' => 'No student record linked to this account.'], 404);
        }

        $student->load(['grades', 'payments', 'attendance']);

        $averageGrade = $student->grades->whereNotNull('grade')->avg('grade');

        return response()->json([
            'student' => $student->load('user'),
            'average_grade' => $averageGrade ? round($averageGrade, 2) : null,
            'balance' => $student->balance(),
            'events_attended' => $student->attendance->whereNotNull('scanned_at')->count(),
            'has_qr' => (bool) $student->qr_code,
        ]);
    }

    public function grades(Request $request)
    {
        $student = $this->resolveStudent($request);

        if (! $student) {
            return response()->json(['message' => 'No student record linked to this account.'], 404);
        }

        return response()->json($student->grades()->orderBy('quarter')->orderBy('subject')->get());
    }

    public function schedule(Request $request)
    {
        $student = $this->resolveStudent($request);

        if (! $student) {
            return response()->json(['message' => 'No student record linked to this account.'], 404);
        }

        $schedule = Schedule::with('teacher')
            ->where('year_level', $student->year_level)
            ->orderBy('day')
            ->orderBy('time')
            ->get();

        return response()->json($schedule);
    }

    public function payments(Request $request)
    {
        $student = $this->resolveStudent($request);

        if (! $student) {
            return response()->json(['message' => 'No student record linked to this account.'], 404);
        }

        $payments = $student->payments()->latest('date')->get();

        return response()->json([
            'payments' => $payments,
            'total_paid' => $student->totalPaid(),
            'total_fee' => $student->currentTotalFee(),
            'balance' => $student->balance(),
        ]);
    }

    public function qr(Request $request)
    {
        $student = $this->resolveStudent($request);

        if (! $student) {
            return response()->json(['message' => 'No student record linked to this account.'], 404);
        }

        return response()->json(['qr_code' => $student->qr_code]);
    }

    public function events(Request $request)
    {
        $student = $this->resolveStudent($request);

        if (! $student) {
            return response()->json(['message' => 'No student record linked to this account.'], 404);
        }

        $events = Event::orderBy('date', 'desc')->get()->map(function (Event $event) use ($student) {
            $attendance = $event->attendance()->where('student_id', $student->id)->first();
            $event->attended = (bool) $attendance?->scanned_at;
            $event->scanned_at = $attendance?->scanned_at;

            return $event;
        });

        return response()->json([
            'events' => $events,
            'attendance_rate' => $events->count() ? round($events->where('attended', true)->count() / $events->count() * 100, 1) : 0,
        ]);
    }
}

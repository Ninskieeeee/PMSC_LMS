<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\Student;
use Illuminate\Http\Request;

class SsgController extends Controller
{
    public function events()
    {
        return response()->json(Event::withCount('attendance')->orderBy('date', 'desc')->get());
    }

    public function storeEvent(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'date' => ['required', 'date'],
        ]);

        $event = Event::create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($event, 201);
    }

    public function destroyEvent(Event $event)
    {
        $event->delete();

        return response()->json(['message' => 'Event deleted.']);
    }

    public function eventAttendance(Event $event)
    {
        return response()->json($event->attendance()->with('student.user')->get());
    }

    public function scan(Request $request)
    {
        $data = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'code' => ['required', 'string'],
        ]);

        $student = Student::with('user')->where('qr_code', $data['code'])->first();

        if (! $student) {
            return response()->json(['message' => 'Unknown QR code.'], 404);
        }

        $exists = EventAttendance::where('event_id', $data['event_id'])
            ->where('student_id', $student->id)
            ->first();

        if ($exists) {
            return response()->json([
                'message' => 'Student already scanned for this event.',
                'student' => $student,
            ], 409);
        }

        $attendance = EventAttendance::create([
            'event_id' => $data['event_id'],
            'student_id' => $student->id,
            'scanned_at' => now(),
        ]);

        return response()->json([
            'message' => 'Attendance recorded.',
            'student' => $student,
            'attendance' => $attendance,
        ], 201);
    }

    public function attendance(Request $request)
    {
        $attendance = EventAttendance::with(['student.user', 'event'])
            ->when($request->event_id, fn ($query, $eventId) => $query->where('event_id', $eventId))
            ->latest('scanned_at')
            ->get();

        return response()->json($attendance);
    }
}

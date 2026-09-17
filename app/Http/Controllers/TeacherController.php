<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function students(Request $request)
    {
        $students = Student::with('user')
            ->when($request->year_level, fn ($query, $yearLevel) => $query->where('year_level', $yearLevel))
            ->orderBy('year_level')
            ->get();

        return response()->json($students);
    }

    public function grades(Request $request)
    {
        $grades = Grade::with('student.user')
            ->when($request->year_level, fn ($query, $yearLevel) => $query->whereHas('student', fn ($q) => $q->where('year_level', $yearLevel)))
            ->when($request->subject, fn ($query, $subject) => $query->where('subject', $subject))
            ->when($request->quarter, fn ($query, $quarter) => $query->where('quarter', $quarter))
            ->get();

        return response()->json($grades);
    }

    public function bulkGrades(Request $request)
    {
        $data = $request->validate([
            'subject' => ['required', 'string'],
            'quarter' => ['required', 'in:1st Quarter,2nd Quarter,3rd Quarter,4th Quarter'],
            'grades' => ['required', 'array', 'min:1'],
            'grades.*.student_id' => ['required', 'exists:students,id'],
            'grades.*.grade' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $teacherId = $request->user()->id;

        DB::transaction(function () use ($data, $teacherId) {
            foreach ($data['grades'] as $entry) {
                Grade::updateOrCreate(
                    [
                        'student_id' => $entry['student_id'],
                        'subject' => $data['subject'],
                        'quarter' => $data['quarter'],
                    ],
                    [
                        'teacher_id' => $teacherId,
                        'grade' => $entry['grade'] ?? null,
                    ]
                );
            }
        });

        return response()->json(['message' => 'Grades saved.']);
    }

    public function gradesPdf(Request $request)
    {
        $yearLevel = $request->query('year_level');

        $students = Student::with(['user', 'grades' => function ($query) use ($request) {
            $query->when($request->query('subject'), fn ($q, $subject) => $q->where('subject', $subject))
                ->when($request->query('quarter'), fn ($q, $quarter) => $q->where('quarter', $quarter));
        }])
            ->when($yearLevel, fn ($query) => $query->where('year_level', $yearLevel))
            ->orderBy('year_level')
            ->get();

        $pdf = Pdf::loadView('pdf.grade-sheet', ['students' => $students, 'yearLevel' => $yearLevel]);

        return $pdf->download('grade-sheet.pdf');
    }

    public function schedule(Request $request)
    {
        $schedule = $request->user()->schedules()->orderBy('day')->orderBy('time')->get();

        return response()->json($schedule);
    }
}

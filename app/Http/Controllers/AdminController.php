<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Grade;
use App\Models\Payment;
use App\Models\Student;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Each payment row carries the fee assessed as of that installment, so the
        // currently assessed total per student is its most recent payment row, not
        // a sum across every installment.
        $totalAssessed = Student::with('payments')->get()->sum(fn (Student $student) => $student->currentTotalFee());

        return response()->json([
            'total_students' => Student::count(),
            'students_by_year_level' => Student::selectRaw('year_level, count(*) as count')
                ->groupBy('year_level')
                ->pluck('count', 'year_level'),
            'staff_counts' => User::whereIn('role', ['admin', 'teacher', 'finance', 'ssg'])
                ->selectRaw('role, count(*) as count')
                ->groupBy('role')
                ->pluck('count', 'role'),
            'total_collected' => (float) Payment::sum('amount_paid'),
            'total_pending' => $totalAssessed - (float) Payment::sum('amount_paid'),
            'upcoming_events' => Event::where('date', '>=', now()->toDateString())
                ->orderBy('date')
                ->take(5)
                ->get(),
        ]);
    }

    public function students(Request $request)
    {
        $students = Student::with('user')
            ->when($request->search, function ($query, $search) {
                $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%")
                    ->orWhere('access_code', 'like', "%{$search}%"));
            })
            ->when($request->year_level, fn ($query, $yearLevel) => $query->where('year_level', $yearLevel))
            ->orderBy('year_level')
            ->get();

        return response()->json($students);
    }

    public function storeStudent(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:users,email'],
            'year_level' => ['required', 'string'],
            'strand' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'guardian_name' => ['nullable', 'string'],
            'guardian_contact' => ['nullable', 'string'],
            'date_enrolled' => ['nullable', 'date'],
        ]);

        $student = DB::transaction(function () use ($data) {
            $accessCode = User::generateAccessCode('student');
            $password = 'Student@123';

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'] ?? null,
                'password' => $password,
                'role' => 'student',
                'access_code' => $accessCode,
            ]);

            return Student::create([
                'user_id' => $user->id,
                'year_level' => $data['year_level'],
                'strand' => $data['strand'] ?? null,
                'qr_code' => $accessCode,
                'address' => $data['address'] ?? null,
                'guardian_name' => $data['guardian_name'] ?? null,
                'guardian_contact' => $data['guardian_contact'] ?? null,
                'date_enrolled' => $data['date_enrolled'] ?? null,
            ]);
        });

        $student->load('user');

        return response()->json([
            'student' => $student,
            'access_code' => $student->qr_code,
            'default_password' => 'Student@123',
        ], 201);
    }

    public function updateStudent(Request $request, Student $student)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:users,email,'.$student->user_id],
            'year_level' => ['sometimes', 'string'],
            'strand' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'guardian_name' => ['nullable', 'string'],
            'guardian_contact' => ['nullable', 'string'],
            'date_enrolled' => ['nullable', 'date'],
        ]);

        $student->update($request->only([
            'year_level', 'strand', 'address', 'guardian_name', 'guardian_contact', 'date_enrolled',
        ]));

        if ($request->has('name') || $request->has('email')) {
            $student->user->update(array_filter([
                'name' => $data['name'] ?? null,
                'email' => $request->has('email') ? $data['email'] : null,
            ], fn ($value) => $value !== null));
        }

        return response()->json($student->load('user'));
    }

    public function destroyStudent(Student $student)
    {
        $user = $student->user;
        $student->delete();
        $user?->delete();

        return response()->json(['message' => 'Student deleted.']);
    }

    public function users(Request $request)
    {
        $users = User::whereIn('role', ['admin', 'teacher', 'finance', 'ssg'])
            ->when($request->role, fn ($query, $role) => $query->where('role', $role))
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    public function storeUser(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:users,email'],
            'role' => ['required', 'in:admin,teacher,finance,ssg'],
        ]);

        $accessCode = User::generateAccessCode($data['role']);
        $password = User::generateTempPassword();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'password' => $password,
            'role' => $data['role'],
            'access_code' => $accessCode,
        ]);

        return response()->json([
            'user' => $user,
            'access_code' => $accessCode,
            'temp_password' => $password,
        ], 201);
    }

    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:users,email,'.$user->id],
            'role' => ['sometimes', 'in:admin,teacher,finance,ssg'],
        ]);

        $user->update($data);

        return response()->json($user);
    }

    public function destroyUser(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }

    public function resetPassword(User $user)
    {
        $password = User::generateTempPassword();
        $user->update(['password' => Hash::make($password)]);

        return response()->json(['temp_password' => $password]);
    }

    public function grades(Request $request)
    {
        $grades = Grade::with(['student.user', 'teacher'])
            ->when($request->year_level, fn ($query, $yearLevel) => $query->whereHas('student', fn ($q) => $q->where('year_level', $yearLevel)))
            ->when($request->quarter, fn ($query, $quarter) => $query->where('quarter', $quarter))
            ->get();

        return response()->json($grades);
    }

    public function payments()
    {
        return response()->json(Payment::with(['student.user', 'recordedBy'])->latest('date')->get());
    }

    public function events()
    {
        return response()->json(Event::withCount('attendance')->orderBy('date', 'desc')->get());
    }

    public function eventAttendance(Event $event)
    {
        return response()->json($event->attendance()->with('student.user')->get());
    }

    public function report(Request $request, string $type)
    {
        $yearLevel = $request->query('year_level');

        return match ($type) {
            'class_list' => $this->classListReport($yearLevel),
            'enrollment' => $this->enrollmentReport(),
            'billing' => $this->billingReport($yearLevel),
            'attendance' => $this->attendanceReport($yearLevel),
            'grade_sheet' => $this->gradeSheetReport($yearLevel),
            default => response()->json(['message' => 'Unknown report type.'], 404),
        };
    }

    private function classListReport(?string $yearLevel)
    {
        $students = Student::with('user')
            ->when($yearLevel, fn ($query) => $query->where('year_level', $yearLevel))
            ->orderBy('year_level')
            ->get();

        $pdf = Pdf::loadView('pdf.class-list', ['students' => $students, 'yearLevel' => $yearLevel]);

        return $pdf->download('class-list.pdf');
    }

    private function enrollmentReport()
    {
        $students = Student::with('user')->orderBy('year_level')->get()->groupBy('year_level');

        $pdf = Pdf::loadView('pdf.enrollment', ['groups' => $students]);

        return $pdf->download('enrollment-report.pdf');
    }

    private function billingReport(?string $yearLevel)
    {
        $students = Student::with(['user', 'payments'])
            ->when($yearLevel, fn ($query) => $query->where('year_level', $yearLevel))
            ->orderBy('year_level')
            ->get();

        $pdf = Pdf::loadView('pdf.billing-summary', ['students' => $students, 'yearLevel' => $yearLevel]);

        return $pdf->download('billing-summary.pdf');
    }

    private function attendanceReport(?string $yearLevel)
    {
        $events = Event::with(['attendance' => function ($query) use ($yearLevel) {
            $query->with('student.user')
                ->when($yearLevel, fn ($q) => $q->whereHas('student', fn ($sq) => $sq->where('year_level', $yearLevel)));
        }])->orderBy('date', 'desc')->get();

        $pdf = Pdf::loadView('pdf.attendance', ['events' => $events, 'yearLevel' => $yearLevel])
            ->setPaper('a4', 'landscape');

        return $pdf->download('attendance-report.pdf');
    }

    private function gradeSheetReport(?string $yearLevel)
    {
        $students = Student::with(['user', 'grades'])
            ->when($yearLevel, fn ($query) => $query->where('year_level', $yearLevel))
            ->orderBy('year_level')
            ->get();

        $pdf = Pdf::loadView('pdf.grade-sheet', ['students' => $students, 'yearLevel' => $yearLevel]);

        return $pdf->download('grade-sheet.pdf');
    }
}

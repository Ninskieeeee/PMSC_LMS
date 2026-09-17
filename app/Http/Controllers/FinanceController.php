<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function students(Request $request)
    {
        $students = Student::with(['user', 'payments'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%")
                    ->orWhere('access_code', 'like', "%{$search}%"));
            })
            ->when($request->year_level, fn ($query, $yearLevel) => $query->where('year_level', $yearLevel))
            ->orderBy('year_level')
            ->get()
            ->map(function (Student $student) {
                $student->total_paid = (float) $student->payments->sum('amount_paid');
                $student->total_fee = (float) $student->payments->sum('total_fee');
                $student->balance = $student->total_fee - $student->total_paid;

                return $student;
            });

        return response()->json($students);
    }

    public function payments(Student $student)
    {
        return response()->json($student->payments()->with('recordedBy')->latest('date')->get());
    }

    public function storePayment(Request $request, Student $student)
    {
        $data = $request->validate([
            'amount_paid' => ['required', 'numeric', 'min:0'],
            'total_fee' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'date' => ['nullable', 'date'],
        ]);

        $payment = $student->payments()->create([
            ...$data,
            'recorded_by' => $request->user()->id,
            'date' => $data['date'] ?? now()->toDateString(),
        ]);

        return response()->json($payment->load('recordedBy'), 201);
    }

    public function billingPdf(Student $student)
    {
        $student->load(['user', 'payments']);

        $pdf = Pdf::loadView('pdf.billing-statement', ['student' => $student]);

        return $pdf->download("billing-statement-{$student->qr_code}.pdf");
    }
}

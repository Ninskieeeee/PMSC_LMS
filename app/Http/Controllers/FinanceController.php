<?php

namespace App\Http\Controllers;

use App\Models\FeeCategory;
use App\Models\Student;
use App\Support\PaymentAllocator;
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
                $student->total_paid = $student->totalPaid();
                $student->total_fee = $student->currentTotalFee();
                $student->balance = $student->balance();

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

    public function feeCategories(Student $student)
    {
        return response()->json($student->feeCategories()->orderBy('id')->get());
    }

    public function storeFeeCategory(Request $request, Student $student)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $category = $student->feeCategories()->create($data);

        return response()->json($category, 201);
    }

    public function updateFeeCategory(Request $request, Student $student, FeeCategory $feeCategory)
    {
        abort_unless($feeCategory->student_id === $student->id, 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $feeCategory->update($data);

        return response()->json($feeCategory);
    }

    public function destroyFeeCategory(Student $student, FeeCategory $feeCategory)
    {
        abort_unless($feeCategory->student_id === $student->id, 404);

        $feeCategory->delete();

        return response()->json(['message' => 'Fee category deleted.']);
    }

    public function paymentBreakdown(Student $student)
    {
        $student->load(['feeCategories', 'payments']);

        return response()->json(PaymentAllocator::allocate($student));
    }
}

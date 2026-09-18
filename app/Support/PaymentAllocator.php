<?php

namespace App\Support;

use App\Models\Student;

/**
 * Splits each of a student's payments across their fee categories, proportional
 * to how much each category still owes at the time of that payment.
 *
 * Categories that are already fully paid are skipped, so later payments only
 * ever apply against what's actually still owed. Money left over once every
 * category is paid off is reported as unallocated credit rather than forced
 * onto a category that doesn't need it.
 */
class PaymentAllocator
{
    public static function allocate(Student $student): array
    {
        $categories = $student->feeCategories->filter(fn ($category) => (float) $category->amount > 0)->values();
        $totalCharges = (float) $categories->sum('amount');

        $remaining = $categories->mapWithKeys(fn ($category) => [$category->id => (float) $category->amount]);

        $payments = $student->payments->sortBy([['date', 'asc'], ['created_at', 'asc']])->values();

        $paymentBreakdowns = $payments->map(function ($payment) use ($categories, &$remaining) {
            $amount = (float) $payment->amount_paid;
            $totalRemaining = (float) $remaining->sum();
            $allocatable = min($amount, $totalRemaining);
            $credit = round($amount - $allocatable, 2);

            $allocations = [];
            $allocatedSoFar = 0.0;
            $eligible = $categories->filter(fn ($category) => $remaining[$category->id] > 0);
            $lastEligibleId = $eligible->last()?->id;

            foreach ($eligible as $category) {
                $share = $totalRemaining > 0 ? $remaining[$category->id] / $totalRemaining : 0;
                $applied = $category->id === $lastEligibleId
                    ? round($allocatable - $allocatedSoFar, 2)
                    : round($allocatable * $share, 2);

                $allocatedSoFar += $applied;
                $remaining[$category->id] = round($remaining[$category->id] - $applied, 2);

                $allocations[] = [
                    'fee_category_id' => $category->id,
                    'name' => $category->name,
                    'category_amount' => (float) $category->amount,
                    'amount_applied' => $applied,
                    'remaining_after' => $remaining[$category->id],
                ];
            }

            return [
                'payment_id' => $payment->id,
                'date' => $payment->date,
                'notes' => $payment->notes,
                'amount' => $amount,
                'allocations' => $allocations,
                'credit' => $credit,
            ];
        });

        return [
            'total_charges' => $totalCharges,
            'categories' => $categories->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'amount' => (float) $category->amount,
                'remaining' => (float) $remaining[$category->id],
                'fully_paid' => $remaining[$category->id] <= 0,
            ])->values(),
            'payments' => $paymentBreakdowns,
            'total_applied' => round($totalCharges - (float) $remaining->sum(), 2),
            'total_remaining' => round((float) $remaining->sum(), 2),
            'total_credit' => round((float) $paymentBreakdowns->sum('credit'), 2),
        ];
    }
}

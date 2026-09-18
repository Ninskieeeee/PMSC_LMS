@extends('pdf.layout')

@section('title', 'Billing Statement')

@php
    $totalFee = $student->currentTotalFee();
    $totalPaid = $student->totalPaid();
    $orderedPayments = $student->payments->sortBy('date')->values();
    $running = 0;
@endphp

@section('content')
    <div class="info-box">
        <div class="info-box-title">STUDENT INFORMATION</div>
        <table class="info-grid">
            <tr>
                <td class="label">Name</td>
                <td class="value">{{ $student->user->name }}</td>
                <td class="label">Access Code</td>
                <td class="value">{{ $student->qr_code }}</td>
            </tr>
            <tr>
                <td class="label">Year Level</td>
                <td class="value">{{ $student->year_level }}{{ $student->strand ? ' - '.$student->strand : '' }}</td>
                <td class="label">Guardian</td>
                <td class="value">{{ $student->guardian_name ?? '—' }}</td>
            </tr>
        </table>
    </div>

    <div class="section-title">Payment Details</div>
    <table class="clean-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Notes</th>
                <th>Recorded By</th>
                <th class="text-right">Amount Paid</th>
                <th class="text-right">Balance</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($orderedPayments as $payment)
                @php
                    $running += (float) $payment->amount_paid;
                    $remaining = $totalFee - $running;
                @endphp
                <tr>
                    <td>{{ optional($payment->date)->format('M j, Y') ?? '—' }}</td>
                    <td>{{ $payment->notes ?? '—' }}</td>
                    <td>{{ $payment->recordedBy->name ?? '—' }}</td>
                    <td class="text-right">{{ number_format($payment->amount_paid, 2) }}</td>
                    <td class="text-right">{{ number_format($remaining, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5">No payment records.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="info-box summary-box" style="width: 50%; margin-left: auto;">
        <div class="info-box-title">SUMMARY OF CHARGES</div>
        <table>
            <tr>
                <td>Total Fee</td>
                <td class="text-right">{{ number_format($totalFee, 2) }}</td>
            </tr>
            <tr>
                <td>Total Paid</td>
                <td class="text-right">{{ number_format($totalPaid, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td>Outstanding Balance</td>
                <td class="text-right">{{ number_format($totalFee - $totalPaid, 2) }}</td>
            </tr>
        </table>
    </div>
@endsection

@section('signatures')
    <tr>
        <td style="width: 50%;">
            <div class="line">Finance Officer</div>
        </td>
        <td style="width: 50%;">
            <div class="line">Received by (Parent/Guardian)</div>
        </td>
    </tr>
@endsection

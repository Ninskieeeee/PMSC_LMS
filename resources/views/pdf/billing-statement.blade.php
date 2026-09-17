@extends('pdf.layout')

@section('title', 'Billing Statement')

@php
    $totalFee = $student->payments->sum('total_fee');
    $totalPaid = $student->payments->sum('amount_paid');
@endphp

@section('content')
    <div class="meta">
        <strong>{{ $student->user->name }}</strong> ({{ $student->qr_code }}) &nbsp;|&nbsp;
        {{ $student->year_level }}{{ $student->strand ? ' - '.$student->strand : '' }}
    </div>

    <div class="section-title">Payment History</div>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th class="text-right">Total Fee</th>
                <th class="text-right">Amount Paid</th>
                <th>Notes</th>
                <th>Recorded By</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($student->payments as $payment)
                <tr>
                    <td>{{ optional($payment->date)->format('M j, Y') ?? '—' }}</td>
                    <td class="text-right">{{ number_format($payment->total_fee, 2) }}</td>
                    <td class="text-right">{{ number_format($payment->amount_paid, 2) }}</td>
                    <td>{{ $payment->notes ?? '—' }}</td>
                    <td>{{ $payment->recordedBy->name ?? '—' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5">No payment records.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table style="margin-top: 16px;">
        <tr>
            <th class="text-right" style="width: 70%;">Total Fee</th>
            <td class="text-right">{{ number_format($totalFee, 2) }}</td>
        </tr>
        <tr>
            <th class="text-right">Total Paid</th>
            <td class="text-right">{{ number_format($totalPaid, 2) }}</td>
        </tr>
        <tr>
            <th class="text-right">Outstanding Balance</th>
            <td class="text-right"><strong>{{ number_format($totalFee - $totalPaid, 2) }}</strong></td>
        </tr>
    </table>
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

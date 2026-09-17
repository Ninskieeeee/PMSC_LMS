@extends('pdf.layout')

@section('title', 'Billing Summary')

@section('content')
    <div class="meta">
        Year Level: <strong>{{ $yearLevel ?? 'All Year Levels' }}</strong> &nbsp;|&nbsp;
        Total Students: <strong>{{ $students->count() }}</strong>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 30px;">#</th>
                <th>Access Code</th>
                <th>Name</th>
                <th>Year Level</th>
                <th class="text-right">Total Fee</th>
                <th class="text-right">Amount Paid</th>
                <th class="text-right">Balance</th>
            </tr>
        </thead>
        <tbody>
            @php $grandFee = 0; $grandPaid = 0; @endphp
            @forelse ($students as $index => $student)
                @php
                    $totalFee = $student->payments->sum('total_fee');
                    $paid = $student->payments->sum('amount_paid');
                    $grandFee += $totalFee;
                    $grandPaid += $paid;
                @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $student->qr_code }}</td>
                    <td>{{ $student->user->name }}</td>
                    <td>{{ $student->year_level }}</td>
                    <td class="text-right">{{ number_format($totalFee, 2) }}</td>
                    <td class="text-right">{{ number_format($paid, 2) }}</td>
                    <td class="text-right">{{ number_format($totalFee - $paid, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7">No students found.</td>
                </tr>
            @endforelse
        </tbody>
        @if ($students->isNotEmpty())
            <tfoot>
                <tr>
                    <th colspan="4" class="text-right">Totals</th>
                    <th class="text-right">{{ number_format($grandFee, 2) }}</th>
                    <th class="text-right">{{ number_format($grandPaid, 2) }}</th>
                    <th class="text-right">{{ number_format($grandFee - $grandPaid, 2) }}</th>
                </tr>
            </tfoot>
        @endif
    </table>
@endsection

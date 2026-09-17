@extends('pdf.layout')

@section('title', 'Grade Sheet')

@section('content')
    <div class="meta">
        Year Level: <strong>{{ $yearLevel ?? 'All Year Levels' }}</strong> &nbsp;|&nbsp;
        Total Students: <strong>{{ $students->count() }}</strong>
    </div>

    @foreach ($students as $student)
        @php
            $bySubject = $student->grades->groupBy('subject');
        @endphp

        <div class="section-title">{{ $student->user->name }} ({{ $student->qr_code }}) &mdash; {{ $student->year_level }}{{ $student->strand ? ' - '.$student->strand : '' }}</div>

        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th class="text-right">1st Quarter</th>
                    <th class="text-right">2nd Quarter</th>
                    <th class="text-right">3rd Quarter</th>
                    <th class="text-right">4th Quarter</th>
                    <th class="text-right">Average</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($bySubject as $subject => $grades)
                    @php
                        $q1 = $grades->firstWhere('quarter', '1st Quarter')?->grade;
                        $q2 = $grades->firstWhere('quarter', '2nd Quarter')?->grade;
                        $q3 = $grades->firstWhere('quarter', '3rd Quarter')?->grade;
                        $q4 = $grades->firstWhere('quarter', '4th Quarter')?->grade;
                        $scores = collect([$q1, $q2, $q3, $q4])->filter(fn ($g) => $g !== null);
                        $average = $scores->isNotEmpty() ? round($scores->avg(), 2) : null;
                        $passed = $average !== null && $average >= 75;
                    @endphp
                    <tr>
                        <td>{{ $subject }}</td>
                        <td class="text-right">{{ $q1 ?? '—' }}</td>
                        <td class="text-right">{{ $q2 ?? '—' }}</td>
                        <td class="text-right">{{ $q3 ?? '—' }}</td>
                        <td class="text-right">{{ $q4 ?? '—' }}</td>
                        <td class="text-right">{{ $average ?? '—' }}</td>
                        <td>
                            @if ($average === null)
                                —
                            @elseif ($passed)
                                <span class="badge-pass">Passed</span>
                            @else
                                <span class="badge-fail">Failed</span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7">No grades recorded.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    @endforeach
@endsection

@section('signatures')
    <tr>
        <td style="width: 33%;">
            <div class="line">Class Adviser</div>
        </td>
        <td style="width: 33%;">
            <div class="line">Registrar</div>
        </td>
        <td style="width: 33%;">
            <div class="line">Principal</div>
        </td>
    </tr>
@endsection

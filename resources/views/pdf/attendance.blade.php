@extends('pdf.layout')

@section('title', 'Attendance Report')

@section('content')
    <div class="meta">
        Year Level Filter: <strong>{{ $yearLevel ?? 'All Year Levels' }}</strong> &nbsp;|&nbsp;
        Total Events: <strong>{{ $events->count() }}</strong>
    </div>

    @foreach ($events as $event)
        <div class="section-title">
            {{ $event->name }} &mdash; {{ optional($event->date)->format('M j, Y') }}
            ({{ $event->attendance->count() }} attendee(s))
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 30px;">#</th>
                    <th>Access Code</th>
                    <th>Name</th>
                    <th>Year Level</th>
                    <th>Scanned At</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($event->attendance as $index => $attendance)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $attendance->student->qr_code }}</td>
                        <td>{{ $attendance->student->user->name }}</td>
                        <td>{{ $attendance->student->year_level }}</td>
                        <td>{{ optional($attendance->scanned_at)->format('M j, Y g:i A') ?? '—' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">No attendance recorded.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    @endforeach
@endsection

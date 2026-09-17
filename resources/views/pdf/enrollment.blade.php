@extends('pdf.layout')

@section('title', 'Enrollment Report')

@section('content')
    <div class="meta">
        Total Enrolled: <strong>{{ $groups->flatten(1)->count() }}</strong> &nbsp;|&nbsp;
        Year Levels: <strong>{{ $groups->count() }}</strong>
    </div>

    @foreach ($groups as $yearLevel => $students)
        <div class="section-title">{{ $yearLevel }} &mdash; {{ $students->count() }} student(s)</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 30px;">#</th>
                    <th>Access Code</th>
                    <th>Name</th>
                    <th>Strand</th>
                    <th>Date Enrolled</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($students as $index => $student)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $student->qr_code }}</td>
                        <td>{{ $student->user->name }}</td>
                        <td>{{ $student->strand ?? '—' }}</td>
                        <td>{{ optional($student->date_enrolled)->format('M j, Y') ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach
@endsection

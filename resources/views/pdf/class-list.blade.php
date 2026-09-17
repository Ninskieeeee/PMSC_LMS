@extends('pdf.layout')

@section('title', 'Class List')

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
                <th>Strand</th>
                <th>Guardian</th>
                <th>Guardian Contact</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($students as $index => $student)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $student->qr_code }}</td>
                    <td>{{ $student->user->name }}</td>
                    <td>{{ $student->year_level }}</td>
                    <td>{{ $student->strand ?? '—' }}</td>
                    <td>{{ $student->guardian_name ?? '—' }}</td>
                    <td>{{ $student->guardian_contact ?? '—' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7">No students found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endsection

@section('signatures')
    <tr>
        <td style="width: 33%;">
            <div class="line">Prepared by</div>
        </td>
        <td style="width: 33%;">
            <div class="line">Checked by</div>
        </td>
        <td style="width: 33%;">
            <div class="line">Approved by (Principal)</div>
        </td>
    </tr>
@endsection

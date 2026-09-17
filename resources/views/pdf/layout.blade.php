<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>@yield('title', 'PMSC Clarin Report')</title>
    <style>
        @page {
            margin: 90px 40px 70px 40px;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1a1a1a;
        }

        header {
            position: fixed;
            top: -70px;
            left: 0;
            right: 0;
            height: 70px;
            border-bottom: 2px solid #0f3d63;
            padding-bottom: 8px;
        }

        header .school-name {
            font-size: 16px;
            font-weight: bold;
            color: #0f3d63;
        }

        header .school-sub {
            font-size: 10px;
            color: #555;
        }

        header .report-title {
            font-size: 13px;
            font-weight: bold;
            text-align: right;
            float: right;
            margin-top: -34px;
        }

        footer {
            position: fixed;
            bottom: -60px;
            left: 0;
            right: 0;
            height: 60px;
            border-top: 1px solid #ccc;
            padding-top: 6px;
            font-size: 9px;
            color: #777;
        }

        footer .confidential {
            font-weight: bold;
            letter-spacing: 1px;
            color: #b02a2a;
        }

        footer .page-number:after {
            content: counter(page) " of " counter(pages);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        th, td {
            border: 1px solid #bbb;
            padding: 5px 6px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background-color: #0f3d63;
            color: #fff;
            font-size: 10px;
            text-transform: uppercase;
        }

        tr:nth-child(even) td {
            background-color: #f4f7fa;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #0f3d63;
            margin-top: 14px;
            margin-bottom: 4px;
        }

        .meta {
            margin-top: 6px;
            font-size: 10px;
            color: #444;
        }

        .signatures {
            margin-top: 50px;
            width: 100%;
        }

        .signatures td {
            border: none;
            text-align: center;
            padding-top: 26px;
        }

        .signatures .line {
            border-top: 1px solid #333;
            padding-top: 4px;
            font-size: 10px;
        }

        .text-right {
            text-align: right;
        }

        .badge-pass {
            color: #1a7a35;
            font-weight: bold;
        }

        .badge-fail {
            color: #b02a2a;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <header>
        <div class="school-name">PMSC Clarin School Management Portal</div>
        <div class="school-sub">Clarin, Bohol, Philippines</div>
        <div class="report-title">@yield('title', 'Report')</div>
    </header>

    <footer>
        <span class="confidential">CONFIDENTIAL</span>
        &mdash; Generated {{ now()->format('F j, Y g:i A') }}
        <span style="float: right;">Page <span class="page-number"></span></span>
    </footer>

    @yield('content')

    @hasSection('signatures')
        <table class="signatures">
            @yield('signatures')
        </table>
    @endif
</body>
</html>

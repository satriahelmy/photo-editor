<!doctype html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="@yield('description', 'Pancarona — a local-first photo editor for thoughtful color.')">
        <meta name="theme-color" content="#151515">
        <link rel="icon" type="image/svg+xml" href="{{ asset('pancarona-mark.svg') }}">
        <title>@yield('title', 'Pancarona')</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="@yield('body-class')">
        @yield('content')
    </body>
</html>

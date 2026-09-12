<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_landing_page_is_available_without_authentication(): void
    {
        $response = $this->get('/');

        $response
            ->assertOk()
            ->assertViewIs('home')
            ->assertSee('Beautiful color grading.')
            ->assertSee('Match Reference');
    }

    public function test_the_editor_shell_is_available_without_authentication(): void
    {
        $response = $this->get('/editor');

        $response
            ->assertOk()
            ->assertViewIs('editor')
            ->assertSee('Drop a photo here')
            ->assertSee('Adjustments');
    }
}

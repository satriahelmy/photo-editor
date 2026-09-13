<?php

declare(strict_types=1);

$directory = __DIR__;

function createFixture(string $path, int $width, int $height, bool $transparent = false): void
{
    $image = imagecreatetruecolor($width, $height);
    imagealphablending($image, false);
    imagesavealpha($image, true);

    $background = imagecolorallocatealpha($image, 16, 18, 22, $transparent ? 127 : 0);
    imagefilledrectangle($image, 0, 0, $width, $height, $background);

    imagealphablending($image, true);
    $warm = imagecolorallocatealpha($image, 220, 128, 72, 0);
    $cool = imagecolorallocatealpha($image, 55, 112, 176, $transparent ? 35 : 0);
    $light = imagecolorallocatealpha($image, 238, 222, 174, 0);

    imagefilledrectangle($image, (int) ($width * 0.08), (int) ($height * 0.12), (int) ($width * 0.58), (int) ($height * 0.72), $warm);
    imagefilledellipse($image, (int) ($width * 0.72), (int) ($height * 0.35), (int) ($width * 0.42), (int) ($height * 0.42), $cool);
    imagefilledpolygon($image, [
        (int) ($width * 0.05), (int) ($height * 0.9),
        (int) ($width * 0.45), (int) ($height * 0.52),
        (int) ($width * 0.95), (int) ($height * 0.9),
    ], 3, $light);

    imagepng($image, $path, 6);
    imagedestroy($image);
}

createFixture($directory.DIRECTORY_SEPARATOR.'qa-portrait.png', 720, 1080);
createFixture($directory.DIRECTORY_SEPARATOR.'qa-square.png', 900, 900);
createFixture($directory.DIRECTORY_SEPARATOR.'qa-transparent.png', 640, 480, true);
createFixture($directory.DIRECTORY_SEPARATOR.'qa-large-dimension.png', 12001, 1);

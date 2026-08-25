<?php
/**
 * Renders the theme's homepage patterns outside WordPress, for design review.
 *
 * The patterns are plain PHP that only touch a handful of WordPress helpers,
 * so stubbing those lets the real pattern output be inspected and screenshotted
 * before a WordPress site exists. This is a development aid, not part of the
 * theme — WordPress never loads it.
 *
 * Usage: php tools/preview-theme.php > site/theme-preview.html
 */

declare( strict_types = 1 );

const THEME_DIR = __DIR__ . '/../theme/kingsword-chicago';

// --- WordPress stubs ------------------------------------------------------

function __( string $text, string $domain = '' ): string {
	return $text;
}
function esc_html( string $text ): string {
	return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
}
function esc_attr( string $text ): string {
	return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
}
function esc_url( string $url ): string {
	return htmlspecialchars( $url, ENT_QUOTES, 'UTF-8' );
}
function esc_html__( string $text, string $domain = '' ): string {
	return esc_html( $text );
}
function esc_attr__( string $text, string $domain = '' ): string {
	return esc_attr( $text );
}
function esc_html_e( string $text, string $domain = '' ): void {
	echo esc_html( $text );
}
function esc_attr_e( string $text, string $domain = '' ): void {
	echo esc_attr( $text );
}
function home_url( string $path = '/' ): string {
	return $path;
}
function get_stylesheet_directory_uri(): string {
	// Relative to site/theme-preview.html, where this output is written.
	return '../theme/kingsword-chicago';
}
function kingsword_image( string $file ): string {
	return esc_url( get_stylesheet_directory_uri() . '/assets/images/' . ltrim( $file, '/' ) );
}

// --- Render ---------------------------------------------------------------

/**
 * Captures a pattern's output, dropping the wp:html block delimiters that only
 * mean something to the block parser.
 */
function render_pattern( string $slug ): string {
	ob_start();
	require THEME_DIR . '/patterns/' . $slug . '.php';
	$html = (string) ob_get_clean();

	return preg_replace( '/<!--\s*\/?wp:html\s*-->/', '', $html );
}

$sections = array( 'masthead', 'home-hero', 'home-sections', 'site-footer' );

echo "<!doctype html>\n";
echo "<html lang=\"en\">\n<head>\n";
echo "<meta charset=\"utf-8\" />\n";
echo "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n";
echo "<title>KingsWord Chicago — theme preview</title>\n";
echo "<link rel=\"stylesheet\" href=\"../theme/kingsword-chicago/style.css\" />\n";

// theme.json normally generates these; emit the ones the stylesheet consumes.
$theme  = json_decode( (string) file_get_contents( THEME_DIR . '/theme.json' ), true );
$vars   = array();
foreach ( $theme['settings']['color']['palette'] as $entry ) {
	$vars[] = sprintf( '  --wp--preset--color--%s: %s;', $entry['slug'], $entry['color'] );
}
foreach ( $theme['settings']['typography']['fontFamilies'] as $family ) {
	$vars[] = sprintf( '  --wp--preset--font-family--%s: %s;', $family['slug'], $family['fontFamily'] );
}

echo "<style>\n";
foreach ( $theme['settings']['typography']['fontFamilies'] as $family ) {
	foreach ( $family['fontFace'] as $face ) {
		printf(
			"@font-face{font-family:\"%s\";src:url(\"%s\") format(\"woff2-variations\");font-weight:%s;font-style:%s;font-display:swap;}\n",
			$face['fontFamily'],
			str_replace( 'file:./', '../theme/kingsword-chicago/', $face['src'][0] ),
			$face['fontWeight'],
			$face['fontStyle']
		);
	}
}
echo ":root{\n" . implode( "\n", $vars ) . "\n}\n";
// Approximate the theme.json style layer the stylesheet builds on top of.
echo "body{margin:0;background:var(--wp--preset--color--bone);color:var(--wp--preset--color--ink);";
echo "font-family:var(--wp--preset--font-family--body);font-size:1.05rem;line-height:1.65;}\n";
echo "h1,h2,h3{font-family:var(--wp--preset--font-family--display);font-weight:600;line-height:1.02;";
echo "letter-spacing:-0.022em;margin:0;text-wrap:balance;}\n";
echo "h1{font-size:clamp(3.1rem,8.6vw,7rem);} h2{font-size:clamp(2.1rem,1.5rem + 2.6vw,3.5rem);} h3{font-size:clamp(1.42rem,1.2rem + 0.7vw,1.72rem);}\n";
echo "p{margin:0;} img{max-width:100%;} *,*::before,*::after{box-sizing:border-box;}\n";
echo "</style>\n</head>\n<body>\n";

foreach ( $sections as $slug ) {
	echo render_pattern( $slug );
	echo "\n";
}

echo "<script src=\"../theme/kingsword-chicago/assets/reveal.js\"></script>\n";
echo "</body>\n</html>\n";

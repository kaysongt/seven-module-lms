<?php
/**
 * KingsWord Chicago theme setup.
 *
 * @package kingsword-chicago
 */

declare( strict_types = 1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const KINGSWORD_VERSION = '0.1.0';

/**
 * Load the stylesheet and the scroll-reveal script.
 */
function kingsword_enqueue_assets(): void {
	$theme = get_stylesheet_directory_uri();

	wp_enqueue_style(
		'kingsword-chicago',
		$theme . '/style.css',
		array(),
		KINGSWORD_VERSION
	);

	wp_enqueue_script(
		'kingsword-reveal',
		$theme . '/assets/reveal.js',
		array(),
		KINGSWORD_VERSION,
		array( 'strategy' => 'defer' )
	);
}
add_action( 'wp_enqueue_scripts', 'kingsword_enqueue_assets' );

/**
 * Mirror the front-end stylesheet into the block editor so patterns are
 * composed against the real design rather than editor defaults.
 */
function kingsword_editor_assets(): void {
	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'kingsword_editor_assets' );

/**
 * Register the pattern category the homepage sections are filed under.
 */
function kingsword_register_pattern_category(): void {
	register_block_pattern_category(
		'kingsword',
		array( 'label' => __( 'KingsWord Chicago', 'kingsword-chicago' ) )
	);
}
add_action( 'init', 'kingsword_register_pattern_category' );

/**
 * Absolute URL for a bundled theme image, for use inside patterns.
 *
 * Patterns ship with the theme rather than the media library, so the paths
 * have to be resolved at render time instead of being hard-coded.
 */
function kingsword_image( string $file ): string {
	return esc_url( get_stylesheet_directory_uri() . '/assets/images/' . ltrim( $file, '/' ) );
}

/**
 * Shared link definitions, kept in their own file so the design-preview tool can
 * load the same source the theme uses instead of restating it.
 */
require_once __DIR__ . "/inc/site-links.php";

<?php
/**
 * Navigation and off-site destinations.
 *
 * @package kingsword-chicago
 */

declare( strict_types = 1 );

/**
 * Off-site destinations the church already uses.
 *
 * Giving and the livestream are not pages on this site — they are a Square
 * checkout and a YouTube channel. They appear in the masthead, the footer and
 * mid-page calls to action, so they are defined once here rather than pasted
 * into four patterns and drifting apart the first time one of them changes.
 */
const KINGSWORD_GIVE_URL  = 'https://checkout.square.site/merchant/Y1YR8C3GQD9HJ/checkout/B5UW3HKWPTGWWFTQQY2F2JZJ';
const KINGSWORD_WATCH_URL = 'https://www.youtube.com/@KingsWordEveryWhere';

/**
 * The primary navigation, shared by the masthead and its mobile panel.
 *
 * Every href is absolute from the site root. They used to be bare fragments
 * like "#visit", which worked while the site was a single page and silently
 * did nothing once there were interior pages to click them from.
 */
function kingsword_nav_links(): array {
	return array(
		array(
			'label' => __( 'About', 'kingsword-chicago' ),
			'href'  => home_url( '/about-us/' ),
		),
		array(
			'label' => __( 'Children', 'kingsword-chicago' ),
			'href'  => home_url( '/children-ministry/' ),
		),
		array(
			'label' => __( 'Believers Training', 'kingsword-chicago' ),
			'href'  => home_url( '/believers-training/' ),
		),
		array(
			'label'    => __( 'Watch', 'kingsword-chicago' ),
			'href'     => KINGSWORD_WATCH_URL,
			'external' => true,
		),
		array(
			'label' => __( 'Visit', 'kingsword-chicago' ),
			'href'  => home_url( '/#visit' ),
		),
		array(
			'label' => __( 'Contact', 'kingsword-chicago' ),
			'href'  => home_url( '/contact/' ),
		),
	);
}

/**
 * Where the Believers Training application lives.
 *
 * The training programme is a separate Next.js application rather than part of
 * WordPress, so the church site links across to it. Set this to that app's
 * origin — no trailing slash — once its domain is settled.
 *
 * Deliberately degrades rather than shipping dead links: while this is empty
 * the training page still reads correctly and points people at Contact instead
 * of at nowhere. Same failure this codebase already hit once, where an empty
 * environment variable was treated as if it were unset.
 */
const KINGSWORD_TRAINING_URL = '';

/**
 * True when the training app has a URL configured.
 */
function kingsword_training_is_live(): bool {
	return '' !== trim( KINGSWORD_TRAINING_URL );
}

/**
 * A URL into the training app, or the contact page while none is configured.
 */
function kingsword_training_url( string $path = '/' ): string {
	if ( ! kingsword_training_is_live() ) {
		return home_url( '/contact/' );
	}

	return rtrim( trim( KINGSWORD_TRAINING_URL ), '/' ) . '/' . ltrim( $path, '/' );
}

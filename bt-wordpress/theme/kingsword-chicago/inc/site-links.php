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
			'href'  => home_url( '/#training' ),
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

<?php
/**
 * Title: Masthead
 * Slug: kingsword-chicago/masthead
 * Categories: kingsword
 * Inserter: no
 *
 * @package kingsword-chicago
 */

$kw_links = array(
	'#welcome'  => __( 'About', 'kingsword-chicago' ),
	'#involved' => __( 'Get Involved', 'kingsword-chicago' ),
	'#training' => __( 'Believers Training', 'kingsword-chicago' ),
	'#watch'    => __( 'Watch', 'kingsword-chicago' ),
	'#visit'    => __( 'Visit', 'kingsword-chicago' ),
);
?>
<!-- wp:html -->
<header class="kw-masthead">
	<div class="kw-masthead__inner">
		<a class="kw-masthead__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'KingsWord Chicago home', 'kingsword-chicago' ); ?>">
			<img src="<?php echo kingsword_image( 'logo-white.png' ); ?>" alt="<?php esc_attr_e( 'KingsWord Everywhere', 'kingsword-chicago' ); ?>" />
		</a>
		<ul class="kw-nav">
			<?php foreach ( $kw_links as $kw_href => $kw_label ) : ?>
				<li><a href="<?php echo esc_attr( $kw_href ); ?>"><?php echo esc_html( $kw_label ); ?></a></li>
			<?php endforeach; ?>
			<li class="kw-nav__menu">
				<details class="kw-mnav">
					<summary>
						<svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true" fill="none">
							<path d="M0 1h15M0 5.5h15M0 10h15" stroke="currentColor" stroke-width="1.6" />
						</svg>
						<?php esc_html_e( 'Menu', 'kingsword-chicago' ); ?>
					</summary>
					<div class="kw-mnav__panel">
						<?php foreach ( $kw_links as $kw_href => $kw_label ) : ?>
							<a href="<?php echo esc_attr( $kw_href ); ?>"><?php echo esc_html( $kw_label ); ?></a>
						<?php endforeach; ?>
					</div>
				</details>
			</li>
			<li class="kw-nav__cta"><a class="kw-btn kw-btn--gold" href="#give"><?php esc_html_e( 'Give', 'kingsword-chicago' ); ?></a></li>
		</ul>
	</div>
</header>
<!-- /wp:html -->

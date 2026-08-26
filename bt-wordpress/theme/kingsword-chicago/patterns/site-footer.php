<?php
/**
 * Title: Site footer
 * Slug: kingsword-chicago/site-footer
 * Categories: kingsword
 * Inserter: no
 *
 * Links are absolute from the site root. They were fragments, which resolved
 * only on the homepage; from any interior page every one of them was inert.
 * The footer also carried id="give" so the Give button scrolled here instead of
 * going anywhere — giving now goes to the church's real Square checkout.
 *
 * @package kingsword-chicago
 */

$kw_gather = array(
	array(
		'label' => __( 'Plan a visit', 'kingsword-chicago' ),
		'href'  => home_url( '/#visit' ),
	),
	array(
		'label' => __( 'Get involved', 'kingsword-chicago' ),
		'href'  => home_url( '/#involved' ),
	),
	array(
		'label' => __( 'Believers Training', 'kingsword-chicago' ),
		'href'  => home_url( '/#training' ),
	),
	array(
		'label'    => __( 'Livestream', 'kingsword-chicago' ),
		'href'     => KINGSWORD_WATCH_URL,
		'external' => true,
	),
	array(
		'label' => __( "Children's ministry", 'kingsword-chicago' ),
		'href'  => home_url( '/children-ministry/' ),
	),
	array(
		'label' => __( 'About us', 'kingsword-chicago' ),
		'href'  => home_url( '/about-us/' ),
	),
	array(
		'label' => __( 'Contact', 'kingsword-chicago' ),
		'href'  => home_url( '/contact/' ),
	),
);

$kw_connect = array(
	array(
		'label' => '+1 773 277 8701',
		'href'  => 'tel:+17732778701',
	),
	array(
		'label' => 'admin@kingsword.org',
		'href'  => 'mailto:admin@kingsword.org',
	),
	array(
		'label'    => __( 'YouTube', 'kingsword-chicago' ),
		'href'     => KINGSWORD_WATCH_URL,
		'external' => true,
	),
	array(
		'label'    => __( '4250 W Walton St', 'kingsword-chicago' ),
		'href'     => 'https://maps.google.com/?q=4250+W+Walton+Street+Chicago+IL+60651',
		'external' => true,
	),
);
?>
<!-- wp:html -->
<footer class="kw-foot">
	<div class="kw-shell">
		<div class="kw-foot__top">
			<div>
				<img src="<?php echo kingsword_image( 'logo-white.png' ); ?>" alt="<?php esc_attr_e( 'KingsWord Everywhere', 'kingsword-chicago' ); ?>" />
				<p style="max-width: 34ch;">
					<?php esc_html_e( 'The apostolic headquarters of a global ministry with churches in Africa, Europe and North America.', 'kingsword-chicago' ); ?>
				</p>
				<p style="margin-top: 1.2rem;">
					<a class="kw-btn kw-btn--gold" href="<?php echo esc_url( KINGSWORD_GIVE_URL ); ?>" target="_blank" rel="noopener">
						<?php esc_html_e( 'Give online', 'kingsword-chicago' ); ?>
					</a>
				</p>
			</div>
			<div>
				<h2><?php esc_html_e( 'Gather', 'kingsword-chicago' ); ?></h2>
				<ul>
					<?php foreach ( $kw_gather as $kw_link ) : ?>
						<li>
							<a href="<?php echo esc_url( $kw_link['href'] ); ?>"<?php echo empty( $kw_link['external'] ) ? '' : ' target="_blank" rel="noopener"'; ?>>
								<?php echo esc_html( $kw_link['label'] ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
			<div>
				<h2><?php esc_html_e( 'Connect', 'kingsword-chicago' ); ?></h2>
				<ul>
					<?php foreach ( $kw_connect as $kw_link ) : ?>
						<li>
							<a href="<?php echo esc_url( $kw_link['href'] ); ?>"<?php echo empty( $kw_link['external'] ) ? '' : ' target="_blank" rel="noopener"'; ?>>
								<?php echo esc_html( $kw_link['label'] ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
		<div class="kw-foot__base">
			<span>
				<?php
				printf(
					/* translators: %s: current year. */
					esc_html__( '© %s KingsWord Chicago. All rights reserved.', 'kingsword-chicago' ),
					esc_html( gmdate( 'Y' ) )
				);
				?>
			</span>
			<span><?php esc_html_e( 'Sundays 10:00 AM · Fridays 7:30 PM', 'kingsword-chicago' ); ?></span>
		</div>
	</div>
</footer>
<!-- /wp:html -->

<?php
/**
 * Title: Masthead
 * Slug: kingsword-chicago/masthead
 * Categories: kingsword
 * Inserter: no
 *
 * Links come from kingsword_nav_links() so the inline bar and the mobile
 * disclosure panel can never disagree about what the navigation is.
 *
 * @package kingsword-chicago
 */

$kw_links = kingsword_nav_links();
?>
<!-- wp:html -->
<header class="kw-masthead">
	<div class="kw-masthead__inner">
		<a class="kw-masthead__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'KingsWord Chicago home', 'kingsword-chicago' ); ?>">
			<img src="<?php echo kingsword_image( 'logo-white.png' ); ?>" alt="<?php esc_attr_e( 'KingsWord Everywhere', 'kingsword-chicago' ); ?>" />
		</a>
		<ul class="kw-nav">
			<?php foreach ( $kw_links as $kw_link ) : ?>
				<li>
					<a href="<?php echo esc_url( $kw_link['href'] ); ?>"<?php echo empty( $kw_link['external'] ) ? '' : ' target="_blank" rel="noopener"'; ?>>
						<?php echo esc_html( $kw_link['label'] ); ?>
					</a>
				</li>
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
						<?php foreach ( $kw_links as $kw_link ) : ?>
							<a href="<?php echo esc_url( $kw_link['href'] ); ?>"<?php echo empty( $kw_link['external'] ) ? '' : ' target="_blank" rel="noopener"'; ?>>
								<?php echo esc_html( $kw_link['label'] ); ?>
							</a>
						<?php endforeach; ?>
						<a href="<?php echo esc_url( KINGSWORD_GIVE_URL ); ?>" target="_blank" rel="noopener">
							<?php esc_html_e( 'Give', 'kingsword-chicago' ); ?>
						</a>
					</div>
				</details>
			</li>
			<li class="kw-nav__cta">
				<a class="kw-btn kw-btn--gold" href="<?php echo esc_url( KINGSWORD_GIVE_URL ); ?>" target="_blank" rel="noopener">
					<?php esc_html_e( 'Give', 'kingsword-chicago' ); ?>
				</a>
			</li>
		</ul>
	</div>
</header>
<!-- /wp:html -->

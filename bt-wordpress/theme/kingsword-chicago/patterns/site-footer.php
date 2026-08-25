<?php
/**
 * Title: Site footer
 * Slug: kingsword-chicago/site-footer
 * Categories: kingsword
 * Inserter: no
 *
 * @package kingsword-chicago
 */

?>
<!-- wp:html -->
<footer class="kw-foot" id="give">
	<div class="kw-shell">
		<div class="kw-foot__top">
			<div>
				<img src="<?php echo kingsword_image( 'logo-white.png' ); ?>" alt="<?php esc_attr_e( 'KingsWord Everywhere', 'kingsword-chicago' ); ?>" />
				<p style="max-width: 34ch;">
					<?php esc_html_e( 'The apostolic headquarters of a global ministry with churches in Africa, Europe and North America.', 'kingsword-chicago' ); ?>
				</p>
				<p style="margin-top: 1.2rem;">
					<a class="kw-btn kw-btn--gold" href="#give"><?php esc_html_e( 'Give online', 'kingsword-chicago' ); ?></a>
				</p>
			</div>
			<div>
				<h2><?php esc_html_e( 'Gather', 'kingsword-chicago' ); ?></h2>
				<ul>
					<li><a href="#visit"><?php esc_html_e( 'Plan a visit', 'kingsword-chicago' ); ?></a></li>
					<li><a href="#involved"><?php esc_html_e( 'Get involved', 'kingsword-chicago' ); ?></a></li>
					<li><a href="#training"><?php esc_html_e( 'Believers Training', 'kingsword-chicago' ); ?></a></li>
					<li><a href="#watch"><?php esc_html_e( 'Livestream', 'kingsword-chicago' ); ?></a></li>
					<li><a href="#visit"><?php esc_html_e( "Children's ministry", 'kingsword-chicago' ); ?></a></li>
				</ul>
			</div>
			<div>
				<h2><?php esc_html_e( 'Connect', 'kingsword-chicago' ); ?></h2>
				<ul>
					<li><a href="tel:+17732778701">+1 773 277 8701</a></li>
					<li><a href="mailto:admin@kingsword.org">admin@kingsword.org</a></li>
					<li><a href="https://www.youtube.com/@KingsWordEveryWhere">YouTube</a></li>
					<li><a href="https://maps.google.com/?q=4250+W+Walton+Street+Chicago+IL+60651">4250 W Walton St</a></li>
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

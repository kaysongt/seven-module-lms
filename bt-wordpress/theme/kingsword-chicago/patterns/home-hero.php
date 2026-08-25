<?php
/**
 * Title: Home — hero and service times
 * Slug: kingsword-chicago/home-hero
 * Categories: kingsword
 *
 * The service-times card deliberately overlaps the hero's bottom edge, so the
 * two are one pattern; splitting them would let an editor break the overlap.
 *
 * @package kingsword-chicago
 */

?>
<!-- wp:html -->
<section class="kw-hero" id="top">
	<div class="kw-hero__media">
		<img src="<?php echo kingsword_image( 'hero-worship.jpg' ); ?>" alt="<?php esc_attr_e( 'The KingsWord Chicago congregation standing in worship', 'kingsword-chicago' ); ?>" />
	</div>
	<div class="kw-hero__grid">
		<div>
			<p class="kw-eyebrow"><?php esc_html_e( 'The Apostolic Place · Chicago', 'kingsword-chicago' ); ?></p>
			<h1><?php esc_html_e( 'Come as you are.', 'kingsword-chicago' ); ?><br /><em><?php esc_html_e( 'Leave built up.', 'kingsword-chicago' ); ?></em></h1>
			<p class="kw-hero__lede">
				<?php esc_html_e( "A Word-centered church on Chicago's West Side, raising people of purpose through the teaching of Scripture and the ministry of the Holy Spirit.", 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--gold" href="#visit"><?php esc_html_e( 'Plan your visit', 'kingsword-chicago' ); ?></a>
				<a class="kw-btn kw-btn--ghost" href="#watch"><?php esc_html_e( 'Watch a service', 'kingsword-chicago' ); ?></a>
			</div>
		</div>
		<dl class="kw-hero__aside">
			<div class="kw-hero__stat">
				<dt><?php esc_html_e( 'Where we meet', 'kingsword-chicago' ); ?></dt>
				<dd><?php esc_html_e( '4250 W Walton St', 'kingsword-chicago' ); ?></dd>
			</div>
			<div class="kw-hero__stat">
				<dt><?php esc_html_e( 'Global ministry', 'kingsword-chicago' ); ?></dt>
				<dd><?php esc_html_e( 'Africa · Europe · N. America', 'kingsword-chicago' ); ?></dd>
			</div>
		</dl>
	</div>
</section>

<section class="kw-times" aria-label="<?php esc_attr_e( 'Service times and location', 'kingsword-chicago' ); ?>">
	<div class="kw-times__card">
		<div class="kw-times__cell">
			<p class="kw-eyebrow"><?php esc_html_e( 'Sunday Service', 'kingsword-chicago' ); ?></p>
			<p class="kw-times__when">10:00 AM</p>
			<p class="kw-times__note"><?php esc_html_e( 'Child care available at every Sunday service.', 'kingsword-chicago' ); ?></p>
		</div>
		<div class="kw-times__cell">
			<p class="kw-eyebrow"><?php esc_html_e( 'Friday Service', 'kingsword-chicago' ); ?></p>
			<p class="kw-times__when">7:30 PM</p>
			<p class="kw-times__note"><?php esc_html_e( 'Midweek teaching, prayer and encounter.', 'kingsword-chicago' ); ?></p>
		</div>
		<div class="kw-times__cell">
			<p class="kw-eyebrow"><?php esc_html_e( 'Find us', 'kingsword-chicago' ); ?></p>
			<p class="kw-times__when kw-times__when--address">
				<?php esc_html_e( '4250 W Walton Street', 'kingsword-chicago' ); ?><br /><?php esc_html_e( 'Chicago, IL 60651', 'kingsword-chicago' ); ?>
			</p>
			<p class="kw-times__note"><?php esc_html_e( 'Free parking in the adjacent lot.', 'kingsword-chicago' ); ?></p>
			<a class="kw-times__link" href="https://maps.google.com/?q=4250+W+Walton+Street+Chicago+IL+60651">
				<?php esc_html_e( 'Get directions →', 'kingsword-chicago' ); ?>
			</a>
		</div>
	</div>
</section>
<!-- /wp:html -->

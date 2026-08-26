<?php
/**
 * Title: Page — Contact
 * Slug: kingsword-chicago/page-contact
 * Categories: kingsword
 *
 * The form posts nowhere yet. The existing site uses an Elementor form, and
 * whichever plugin replaces it will supply its own block, so this markup is the
 * layout and labelling only — deliberately not wired to a handler that does not
 * exist. Address, telephone and email are the church's real details.
 *
 * @package kingsword-chicago
 */

$kw_reach = array(
	array(
		'label' => __( 'Address', 'kingsword-chicago' ),
		'value' => __( '4250 W Walton Street, Chicago, IL 60651', 'kingsword-chicago' ),
	),
	array(
		'label' => __( 'Telephone', 'kingsword-chicago' ),
		'value' => '+1 773 277 8701',
	),
	array(
		'label' => __( 'Email', 'kingsword-chicago' ),
		'value' => 'admin@kingsword.org',
	),
	array(
		'label' => __( 'Sundays', 'kingsword-chicago' ),
		'value' => __( '10:00 AM — child care available', 'kingsword-chicago' ),
	),
	array(
		'label' => __( 'Fridays', 'kingsword-chicago' ),
		'value' => __( '7:30 PM — midweek teaching and prayer', 'kingsword-chicago' ),
	),
);
?>
<!-- wp:html -->
<section class="kw-page-hero" id="top">
	<div class="kw-page-hero__grid">
		<div>
			<p class="kw-eyebrow"><?php esc_html_e( 'Contact', 'kingsword-chicago' ); ?></p>
			<h1><?php esc_html_e( 'Tell us you are', 'kingsword-chicago' ); ?> <em><?php esc_html_e( 'coming', 'kingsword-chicago' ); ?></em></h1>
			<p class="kw-page-hero__lede">
				<?php esc_html_e( 'Questions about a first visit, prayer requests, testimonies, or anything else — someone here reads every message.', 'kingsword-chicago' ); ?>
			</p>
		</div>
	</div>
</section>

<section class="kw-band" id="reach">
	<div class="kw-shell kw-split kw-reveal">
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'Send a message', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( 'Prayer points, testimonies, or a question.', 'kingsword-chicago' ); ?></h2>
			</div>
			<form class="kw-form" method="post" action="">
				<div class="kw-form__row">
					<label class="kw-field">
						<span><?php esc_html_e( 'Your name', 'kingsword-chicago' ); ?></span>
						<input type="text" name="kw_name" autocomplete="name" required />
					</label>
					<label class="kw-field">
						<span><?php esc_html_e( 'Your email', 'kingsword-chicago' ); ?></span>
						<input type="email" name="kw_email" autocomplete="email" required />
					</label>
				</div>
				<div class="kw-form__row">
					<label class="kw-field">
						<span><?php esc_html_e( 'Phone', 'kingsword-chicago' ); ?></span>
						<input type="tel" name="kw_phone" autocomplete="tel" />
					</label>
					<label class="kw-field">
						<span><?php esc_html_e( 'Subject', 'kingsword-chicago' ); ?></span>
						<input type="text" name="kw_subject" />
					</label>
				</div>
				<label class="kw-field">
					<span><?php esc_html_e( 'Your message', 'kingsword-chicago' ); ?></span>
					<textarea name="kw_message" rows="5"></textarea>
				</label>
				<div class="kw-actions">
					<button class="kw-btn kw-btn--ink" type="submit"><?php esc_html_e( 'Send message', 'kingsword-chicago' ); ?></button>
				</div>
			</form>
		</div>
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'Find us', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( 'On the West Side.', 'kingsword-chicago' ); ?></h2>
			</div>
			<dl class="kw-visit">
				<?php foreach ( $kw_reach as $kw_item ) : ?>
					<div>
						<dt><?php echo esc_html( $kw_item['label'] ); ?></dt>
						<dd><?php echo esc_html( $kw_item['value'] ); ?></dd>
					</div>
				<?php endforeach; ?>
			</dl>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--ink" href="https://maps.google.com/?q=4250+W+Walton+Street+Chicago+IL+60651" target="_blank" rel="noopener">
					<?php esc_html_e( 'Get directions →', 'kingsword-chicago' ); ?>
				</a>
			</div>
		</div>
	</div>
</section>

<section class="kw-band kw-band--dark" id="global">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'KingsWord everywhere', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'Churches across Africa, Europe and North America.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-creed">
			<p class="kw-lede">
				<?php esc_html_e( 'Chicago is the apostolic headquarters. If you are looking for a KingsWord house closer to you, start with the international site.', 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--gold" href="https://kingsword.org" target="_blank" rel="noopener">
					<?php esc_html_e( 'KingsWord International →', 'kingsword-chicago' ); ?>
				</a>
			</div>
		</div>
	</div>
</section>
<!-- /wp:html -->

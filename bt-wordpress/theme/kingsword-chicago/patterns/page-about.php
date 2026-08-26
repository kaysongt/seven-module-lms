<?php
/**
 * Title: Page — About Us
 * Slug: kingsword-chicago/page-about
 * Categories: kingsword
 *
 * The mission statement is carried over close to verbatim from the existing
 * site. It is doctrinal identity language the church chose for itself, so it is
 * re-set rather than rewritten; only the sentence breaks are eased so it can be
 * read on a phone.
 *
 * @package kingsword-chicago
 */

$kw_leaders = array(
	array(
		'name'  => __( 'Dr Kayode Ijisesan', 'kingsword-chicago' ),
		'role'  => __( 'President, KingsWord Ministries International', 'kingsword-chicago' ),
		'copy'  => __( 'Founder of KingsWord Ministries International, overseeing a global apostolic work with churches across Africa, Europe and North America.', 'kingsword-chicago' ),
	),
	array(
		'name'  => __( 'Pastor May Ijisesan', 'kingsword-chicago' ),
		'role'  => __( 'Senior Pastor', 'kingsword-chicago' ),
		'copy'  => __( 'Leads the Chicago congregation, with a particular ministry to women carrying the weight of leadership in the local church.', 'kingsword-chicago' ),
	),
);

$kw_commitments = array(
	array(
		'title' => __( 'Proclaim Jesus', 'kingsword-chicago' ),
		'copy'  => __( 'To present the Anointed One clearly to a dying world, without apology and without dilution.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Teach the Word', 'kingsword-chicago' ),
		'copy'  => __( 'To help people build a stronger relationship with the Lord through the preaching and teaching of Scripture.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Emphasize victory', 'kingsword-chicago' ),
		'copy'  => __( 'To hold out victory in life by the Word and by the ministry of the Holy Spirit.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Release purpose', 'kingsword-chicago' ),
		'copy'  => __( "To train, equip and release God's children into the fullness of their God-given purpose.", 'kingsword-chicago' ),
	),
);
?>
<!-- wp:html -->
<section class="kw-page-hero" id="top">
	<div class="kw-page-hero__grid">
		<div>
			<p class="kw-eyebrow"><?php esc_html_e( 'About us', 'kingsword-chicago' ); ?></p>
			<h1><?php esc_html_e( 'Raising a', 'kingsword-chicago' ); ?> <em><?php esc_html_e( 'supernatural army', 'kingsword-chicago' ); ?></em></h1>
			<p class="kw-page-hero__lede">
				<?php esc_html_e( 'KingsWord International Church, Chicago is committed to raising a people of purpose — and to sending them back out into the city stronger than they arrived.', 'kingsword-chicago' ); ?>
			</p>
		</div>
	</div>
</section>

<section class="kw-band" id="mission">
	<div class="kw-shell kw-split kw-reveal">
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'Our mission', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( 'A people of purpose, trained and released.', 'kingsword-chicago' ); ?></h2>
			</div>
			<p class="kw-lede">
				<?php esc_html_e( 'We are committed to raising a people of purpose: to proclaim Jesus, the Anointed One, and to present Him clearly to a dying world.', 'kingsword-chicago' ); ?>
			</p>
			<p class="kw-lede" style="margin-top: 1.1rem;">
				<?php esc_html_e( 'We are called to help people build a stronger relationship with the Lord through the preaching and teaching of the Word. We emphasize victory in life by the Word and the ministry of the Holy Spirit. We are anointed to train, equip and release God’s children into the fullness of their God-given purpose.', 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--ink" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Talk to someone', 'kingsword-chicago' ); ?></a>
			</div>
		</div>
		<figure class="kw-figure kw-figure--tall">
			<img src="<?php echo kingsword_image( 'community.jpg' ); ?>" alt="<?php esc_attr_e( 'Members of KingsWord Chicago gathered together', 'kingsword-chicago' ); ?>" />
		</figure>
	</div>
</section>

<section class="kw-band kw-band--sunk" id="commitments">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'What we are for', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'Four commitments we keep coming back to.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-rail">
			<?php foreach ( $kw_commitments as $kw_item ) : ?>
				<article class="kw-path">
					<h3><?php echo esc_html( $kw_item['title'] ); ?></h3>
					<p><?php echo esc_html( $kw_item['copy'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="kw-band" id="leaders">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'Meet our leaders', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'The people who carry this house.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-rail">
			<?php foreach ( $kw_leaders as $kw_leader ) : ?>
				<article class="kw-path">
					<h3><?php echo esc_html( $kw_leader['name'] ); ?></h3>
					<p class="kw-path__label"><?php echo esc_html( $kw_leader['role'] ); ?></p>
					<p><?php echo esc_html( $kw_leader['copy'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="kw-band kw-band--dark" id="everywhere">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'KingsWord everywhere', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'The apostolic headquarters of a global ministry.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-creed">
			<p class="kw-lede">
				<?php esc_html_e( 'Chicago is the apostolic headquarters of a work that now spans Africa, Europe and North America. What is taught here is taught in every one of those houses.', 'kingsword-chicago' ); ?>
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

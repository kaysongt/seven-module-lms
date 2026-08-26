<?php
/**
 * Title: Page — Children Ministry
 * Slug: kingsword-chicago/page-children
 * Categories: kingsword
 *
 * Values, scriptures and programme names are the church's own, carried across
 * from the existing page. The emoji that headed each value there are dropped:
 * this theme already has a typographic label for that job, and a parent
 * scanning on a phone gets more from a consistent eyebrow than from a glyph
 * that renders differently on every device.
 *
 * @package kingsword-chicago
 */

$kw_values = array(
	array(
		'title'   => __( 'Love and compassion', 'kingsword-chicago' ),
		'copy'    => __( 'We teach children that love is more than a feeling — it is a way of life. Our kids learn to be kind, caring and full of compassion, just like Jesus.', 'kingsword-chicago' ),
		'verse'   => __( '1 John 4:7–8', 'kingsword-chicago' ),
	),
	array(
		'title'   => __( 'Honesty and integrity', 'kingsword-chicago' ),
		'copy'    => __( 'Truth matters. We build the courage to speak truthfully and live with integrity, and help children see that honesty honours God and earns trust.', 'kingsword-chicago' ),
		'verse'   => __( 'Ephesians 4:25', 'kingsword-chicago' ),
	),
	array(
		'title'   => __( 'Spiritual habits', 'kingsword-chicago' ),
		'copy'    => __( 'Prayer, worship and Bible reading become part of a child’s rhythm of life — not chores, but habits that build a foundation which holds.', 'kingsword-chicago' ),
		'verse'   => __( 'Proverbs 22:6', 'kingsword-chicago' ),
	),
);

$kw_habits = array(
	array(
		'title' => __( 'Prayer', 'kingsword-chicago' ),
		'copy'  => __( 'Children learn to talk to God every day, and to bring Him everything rather than only the tidy parts.', 'kingsword-chicago' ),
		'verse' => __( 'Philippians 4:6–7', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Worship', 'kingsword-chicago' ),
		'copy'  => __( 'Joyful, unembarrassed worship — so that praising God is something they associate with gladness.', 'kingsword-chicago' ),
		'verse' => __( 'Psalm 100:2', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Bible reading', 'kingsword-chicago' ),
		'copy'  => __( 'Scripture is alive and is their guide for truth and right living. We make daily reading something they want to do.', 'kingsword-chicago' ),
		'verse' => __( '2 Timothy 3:16–17', 'kingsword-chicago' ),
	),
);

$kw_programmes = array(
	array(
		'title' => __( 'Vacation Bible School', 'kingsword-chicago' ),
		'copy'  => __( 'A week of teaching, games and worship built around one big idea from Scripture.', 'kingsword-chicago' ),
		'href'  => '/children-ministry/vacation-bible-school/',
	),
	array(
		'title' => __( 'Back to School', 'kingsword-chicago' ),
		'copy'  => __( 'Sending our children into a new school year prayed for, supplied and encouraged.', 'kingsword-chicago' ),
		'href'  => '/children-ministry/back-to-school/',
	),
	array(
		'title' => __( 'Hallelujah Night', 'kingsword-chicago' ),
		'copy'  => __( 'A safe, joyful alternative on the night the rest of the city does something else.', 'kingsword-chicago' ),
		'href'  => '/children-ministry/hallelujah-night/',
	),
	array(
		'title' => __( 'Christmas Production', 'kingsword-chicago' ),
		'copy'  => __( 'Our children tell the Christmas story themselves, on stage, to the whole house.', 'kingsword-chicago' ),
		'href'  => '/children-ministry/christmas-production/',
	),
);
?>
<!-- wp:html -->
<section class="kw-page-hero" id="top">
	<div class="kw-page-hero__grid">
		<div>
			<p class="kw-eyebrow"><?php esc_html_e( 'Children Ministry', 'kingsword-chicago' ); ?></p>
			<h1><?php esc_html_e( 'Raising', 'kingsword-chicago' ); ?> <em><?php esc_html_e( 'spirit-filled children', 'kingsword-chicago' ); ?></em></h1>
			<p class="kw-page-hero__lede">
				<?php esc_html_e( 'Kids who know God, love His Word and walk in His ways — nurtured here every Sunday, with child care available at every service.', 'kingsword-chicago' ); ?>
			</p>
		</div>
	</div>
</section>

<section class="kw-band" id="promise">
	<div class="kw-shell kw-split kw-reveal">
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'Our calling', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( 'This is not just what we do. It is who we are.', 'kingsword-chicago' ); ?></h2>
			</div>
			<p class="kw-lede">
				<?php esc_html_e( 'At the heart of our children’s ministry is a joyful commitment to raising spirit-filled children. That journey starts with nurturing their faith, shaping their hearts with biblical truth, and encouraging a personal relationship with Jesus.', 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--ink" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Ask about Sundays', 'kingsword-chicago' ); ?></a>
			</div>
		</div>
		<?php
		/*
		 * Scripture rather than a photograph. The theme ships three stock images
		 * and every one of them shows adults, so putting one here would caption a
		 * children's ministry with a picture of grown-ups — and repeat the image
		 * already used on About. Swap this for a real photograph of the ministry
		 * when the church supplies one.
		 */
		?>
		<figure class="kw-quote">
			<?php // Kept on one line: a newline here becomes a space, and the quote marks are generated, so it would show as “ text ”. ?>
			<blockquote><?php esc_html_e( 'Train up a child in the way he should go, and when he is old he will not depart from it.', 'kingsword-chicago' ); ?></blockquote>
			<figcaption><?php esc_html_e( 'Proverbs 22:6', 'kingsword-chicago' ); ?></figcaption>
		</figure>
	</div>
</section>

<section class="kw-band kw-band--sunk" id="values">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'What guides us', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'Three things we are deliberate about.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-rail">
			<?php foreach ( $kw_values as $kw_value ) : ?>
				<article class="kw-path">
					<h3><?php echo esc_html( $kw_value['title'] ); ?></h3>
					<p class="kw-leader__role"><?php echo esc_html( $kw_value['verse'] ); ?></p>
					<p><?php echo esc_html( $kw_value['copy'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="kw-band" id="habits">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'Habits we build', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'Prayer, worship, and the Word — every week.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-rail">
			<?php foreach ( $kw_habits as $kw_habit ) : ?>
				<article class="kw-path">
					<h3><?php echo esc_html( $kw_habit['title'] ); ?></h3>
					<p class="kw-leader__role"><?php echo esc_html( $kw_habit['verse'] ); ?></p>
					<p><?php echo esc_html( $kw_habit['copy'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="kw-band kw-band--dark" id="programmes">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'Through the year', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'The moments our children look forward to.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-rail">
			<?php foreach ( $kw_programmes as $kw_programme ) : ?>
				<article class="kw-path">
					<h3><?php echo esc_html( $kw_programme['title'] ); ?></h3>
					<p><?php echo esc_html( $kw_programme['copy'] ); ?></p>
					<a class="kw-times__link" href="<?php echo esc_url( $kw_programme['href'] ); ?>">
						<?php esc_html_e( 'Details →', 'kingsword-chicago' ); ?>
					</a>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
<!-- /wp:html -->

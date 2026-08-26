<?php
/**
 * Title: Page — Believers Training
 * Slug: kingsword-chicago/page-training
 * Categories: kingsword
 *
 * The church-side face of the Believers Training programme. The programme
 * itself runs in a separate Next.js application, so this page's job is to
 * explain it, show the curriculum, and hand people across — not to reimplement
 * lessons or progress here.
 *
 * Module titles and summaries are the real curriculum, taken from
 * content/bt-content-bundle.json. They are written out rather than read from
 * that file at runtime because a theme should not depend on a build artefact
 * that does not ship inside it. Regenerate them from the bundle if the
 * curriculum changes.
 *
 * @package kingsword-chicago
 */

$kw_modules = array(
	array(
		'title' => __( 'The New Covenant', 'kingsword-chicago' ),
		'copy'  => __( 'Christianity is not fundamentally a religion of rules, rituals, or human performance.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Identity in Christ', 'kingsword-chicago' ),
		'copy'  => __( 'Many believers struggle not because Christ has failed them, but because they do not understand who they are in Him.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'The Word: The Agent of Change', 'kingsword-chicago' ),
		'copy'  => __( 'Transformation does not come primarily through willpower, emotion, or religious effort.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'The Ministry of the Holy Spirit', 'kingsword-chicago' ),
		'copy'  => __( 'The Christian life was never designed to be lived by human effort, discipline, or willpower.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Spiritual Authority and Prayer', 'kingsword-chicago' ),
		'copy'  => __( 'Prayer is not begging God to act. It is partnering with Him to release what He has already willed.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Purpose and Calling', 'kingsword-chicago' ),
		'copy'  => __( 'Many believers feel pressure to discover their purpose as though it were hidden or easily missed.', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Stewardship and Missional Lifestyle', 'kingsword-chicago' ),
		'copy'  => __( 'Stewardship and mission are not separate aspects of the Christian life.', 'kingsword-chicago' ),
	),
);

$kw_facts = array(
	array(
		'label' => __( 'Structure', 'kingsword-chicago' ),
		'value' => __( 'Seven modules, eleven lessons each — 77 in all', 'kingsword-chicago' ),
	),
	array(
		'label' => __( 'Order', 'kingsword-chicago' ),
		'value' => __( 'Sequential. Each module opens when the one before it is passed.', 'kingsword-chicago' ),
	),
	array(
		'label' => __( 'Assessment', 'kingsword-chicago' ),
		'value' => __( 'A quiz at the end of every module, passed at 80%.', 'kingsword-chicago' ),
	),
	array(
		'label' => __( 'Joining', 'kingsword-chicago' ),
		'value' => __( 'By application. Approved applicants receive a private activation link.', 'kingsword-chicago' ),
	),
);

$kw_live   = kingsword_training_is_live();
$kw_primary = $kw_live ? __( 'Apply to join', 'kingsword-chicago' ) : __( 'Ask about the next intake', 'kingsword-chicago' );
?>
<!-- wp:html -->
<section class="kw-page-hero" id="top">
	<div class="kw-page-hero__grid">
		<div>
			<p class="kw-eyebrow"><?php esc_html_e( 'Believers Training', 'kingsword-chicago' ); ?></p>
			<h1><?php esc_html_e( 'Grounded, then', 'kingsword-chicago' ); ?> <em><?php esc_html_e( 'sent', 'kingsword-chicago' ); ?></em></h1>
			<p class="kw-page-hero__lede">
				<?php esc_html_e( 'A seven-module discipleship programme from the KingsWord Training Institute — the same teaching this house is built on, taken at your own pace.', 'kingsword-chicago' ); ?>
			</p>
		</div>
	</div>
</section>

<section class="kw-band" id="what">
	<div class="kw-shell kw-split kw-reveal">
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'What it is', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( 'Not a course you skim. A foundation you keep.', 'kingsword-chicago' ); ?></h2>
			</div>
			<p class="kw-lede">
				<?php esc_html_e( 'Believers Training walks through what it means to live in the New Covenant: who you are in Christ, how the Word changes you, how the Spirit works, how to pray with authority, and what you were made to do with all of it.', 'kingsword-chicago' ); ?>
			</p>
			<p class="kw-lede" style="margin-top: 1.1rem;">
				<?php esc_html_e( 'It is taught in order, assessed honestly, and finished with something to show for it. You do it online, in your own time, and you carry it into the room you already lead in.', 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--ink" href="<?php echo esc_url( kingsword_training_url( '/apply' ) ); ?>"<?php echo $kw_live ? ' target="_blank" rel="noopener"' : ''; ?>>
					<?php echo esc_html( $kw_primary ); ?>
				</a>
				<?php if ( $kw_live ) : ?>
					<a class="kw-btn kw-btn--ink" href="<?php echo esc_url( kingsword_training_url( '/login' ) ); ?>" target="_blank" rel="noopener">
						<?php esc_html_e( 'Sign in', 'kingsword-chicago' ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
		<dl class="kw-visit">
			<?php foreach ( $kw_facts as $kw_fact ) : ?>
				<div>
					<dt><?php echo esc_html( $kw_fact['label'] ); ?></dt>
					<dd><?php echo esc_html( $kw_fact['value'] ); ?></dd>
				</div>
			<?php endforeach; ?>
		</dl>
	</div>
</section>

<section class="kw-band kw-band--sunk" id="curriculum">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'The curriculum', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'Seven modules, taken in order.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-rail">
			<?php foreach ( $kw_modules as $kw_index => $kw_module ) : ?>
				<article class="kw-path">
					<p class="kw-path__label">
						<?php
						printf(
							/* translators: %d: module number. */
							esc_html__( 'Module %d', 'kingsword-chicago' ),
							(int) $kw_index + 1
						);
						?>
					</p>
					<h3><?php echo esc_html( $kw_module['title'] ); ?></h3>
					<p><?php echo esc_html( $kw_module['copy'] ); ?></p>
				</article>
			<?php endforeach; ?>
			<?php
			/*
			 * Eighth cell. Seven cards in a four-column rail leave a hole that
			 * renders as a bare strip of the rail's rule colour, so the space
			 * carries the call to action instead of being padded shut.
			 */
			?>
			<a class="kw-path kw-path--cta" href="<?php echo esc_url( kingsword_training_url( '/apply' ) ); ?>"<?php echo $kw_live ? ' target="_blank" rel="noopener"' : ''; ?>>
				<h3><?php esc_html_e( 'Start module one', 'kingsword-chicago' ); ?></h3>
				<p><?php esc_html_e( 'The whole programme is free, and opens as soon as your place is confirmed.', 'kingsword-chicago' ); ?></p>
				<?php // No trailing arrow: the label runs long enough to wrap it onto its own line. ?>
				<span class="kw-path__go"><?php echo esc_html( $kw_primary ); ?></span>
			</a>
		</div>
	</div>
</section>

<section class="kw-band kw-band--dark" id="join">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'Joining', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'Start where you are.', 'kingsword-chicago' ); ?></h2>
		</div>
		<div class="kw-creed">
			<p class="kw-lede">
				<?php
				if ( $kw_live ) {
					esc_html_e( 'Apply once, and a private activation link comes back to you by email. There is no cost, and no deadline to keep up with — the modules wait for you.', 'kingsword-chicago' );
				} else {
					esc_html_e( 'Applications for the next intake are handled by the church office. Tell us you are interested and we will send you the details as soon as they are set.', 'kingsword-chicago' );
				}
				?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--gold" href="<?php echo esc_url( kingsword_training_url( '/apply' ) ); ?>"<?php echo $kw_live ? ' target="_blank" rel="noopener"' : ''; ?>>
					<?php echo esc_html( $kw_primary ); ?>
				</a>
			</div>
		</div>
	</div>
</section>
<!-- /wp:html -->

<?php
/**
 * Title: Home — main sections
 * Slug: kingsword-chicago/home-sections
 * Categories: kingsword
 *
 * Everything below the hero: who we are, the mission, ways to belong,
 * Believers Training, the livestream, and visit details.
 *
 * @package kingsword-chicago
 */

$kw_paths = array(
	array(
		'title' => __( 'Membership', 'kingsword-chicago' ),
		'copy'  => __( 'Understand the house, its vision and its doctrine, then formally make it yours.', 'kingsword-chicago' ),
		'go'    => __( 'Join the next class →', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Small Groups', 'kingsword-chicago' ),
		'copy'  => __( 'Meet through the week with a handful of people who will actually know your name.', 'kingsword-chicago' ),
		'go'    => __( 'Find a group →', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Units', 'kingsword-chicago' ),
		'copy'  => __( 'Serve on a team and help carry the weight of what happens every Sunday.', 'kingsword-chicago' ),
		'go'    => __( 'Start serving →', 'kingsword-chicago' ),
	),
	array(
		'title' => __( 'Life Groups', 'kingsword-chicago' ),
		'copy'  => __( 'Gather by life stage — students, singles, couples, parents — for what you are walking through now.', 'kingsword-chicago' ),
		'go'    => __( 'See the groups →', 'kingsword-chicago' ),
	),
);

$kw_modules = array(
	__( 'The New Covenant', 'kingsword-chicago' ),
	__( 'Identity in Christ', 'kingsword-chicago' ),
	__( 'The Word: The Agent of Change', 'kingsword-chicago' ),
	__( 'The Ministry of the Holy Spirit', 'kingsword-chicago' ),
	__( 'Spiritual Authority and Prayer', 'kingsword-chicago' ),
	__( 'Purpose and Calling', 'kingsword-chicago' ),
	__( 'Stewardship and Missional Lifestyle', 'kingsword-chicago' ),
);
?>
<!-- wp:html -->
<section class="kw-band" id="welcome">
	<div class="kw-shell kw-split kw-reveal">
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'Who we are', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( 'A house that sends people out stronger than they came in.', 'kingsword-chicago' ); ?></h2>
			</div>
			<p class="kw-lede">
				<?php esc_html_e( "KingsWord Chicago is the apostolic headquarters of a global ministry with churches across Africa, Europe and North America. We are here to train, equip and release God's children into their divine purpose — teaching victory in life through the Word and the ministry of the Holy Spirit.", 'kingsword-chicago' ); ?>
			</p>
			<p class="kw-lede" style="margin-top: 1.1rem;">
				<?php esc_html_e( 'Whether it is your first Sunday or your fifteenth year, there is a place for you here, and a next step waiting when you are ready to take it.', 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--ink" href="#involved"><?php esc_html_e( 'Find your place', 'kingsword-chicago' ); ?></a>
			</div>
		</div>
		<figure class="kw-figure kw-figure--tall">
			<img src="<?php echo kingsword_image( 'welcome.jpg' ); ?>" alt="<?php esc_attr_e( 'Members of KingsWord Chicago together after a Sunday service', 'kingsword-chicago' ); ?>" />
		</figure>
	</div>
</section>

<section class="kw-band kw-band--dark">
	<div class="kw-shell kw-reveal">
		<p class="kw-eyebrow"><?php esc_html_e( 'Our mission', 'kingsword-chicago' ); ?></p>
		<div class="kw-creed">
			<blockquote><?php esc_html_e( 'To proclaim Jesus, the Anointed One, and present Him clearly to a dying world.', 'kingsword-chicago' ); ?></blockquote>
			<div class="kw-creed__side">
				<p><?php esc_html_e( 'That mission shapes everything here — what gets taught on a Sunday, what we train people for, and who we send out.', 'kingsword-chicago' ); ?></p>
				<p class="kw-creed__attr"><?php esc_html_e( 'Raising a supernatural army', 'kingsword-chicago' ); ?></p>
			</div>
		</div>
	</div>
</section>

<section class="kw-band" id="involved">
	<div class="kw-shell kw-reveal">
		<div class="kw-section-head">
			<p class="kw-eyebrow"><?php esc_html_e( 'Get involved', 'kingsword-chicago' ); ?></p>
			<h2><?php esc_html_e( 'Four ways to belong.', 'kingsword-chicago' ); ?></h2>
			<p class="kw-lede"><?php esc_html_e( 'Every one of them starts with a conversation, not a commitment.', 'kingsword-chicago' ); ?></p>
		</div>
		<div class="kw-rail">
			<?php foreach ( $kw_paths as $kw_path ) : ?>
				<a class="kw-path" href="#visit">
					<h3><?php echo esc_html( $kw_path['title'] ); ?></h3>
					<p><?php echo esc_html( $kw_path['copy'] ); ?></p>
					<span class="kw-path__go"><?php echo esc_html( $kw_path['go'] ); ?></span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="kw-band kw-band--dark" id="training">
	<div class="kw-shell kw-split kw-split--flip kw-reveal">
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'Believers Training', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( 'Seven modules. One settled believer.', 'kingsword-chicago' ); ?></h2>
			</div>
			<p class="kw-lede">
				<?php esc_html_e( 'Our discipleship track takes you through covenant, identity, Scripture, the Holy Spirit, prayer, purpose and stewardship — seventy-seven lessons with a checkpoint at the end of every module. Work at your own pace, online.', 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--gold" href="#training"><?php esc_html_e( 'Apply to the program', 'kingsword-chicago' ); ?></a>
				<a class="kw-btn kw-btn--ghost" href="#training"><?php esc_html_e( 'See the curriculum', 'kingsword-chicago' ); ?></a>
			</div>
		</div>
		<ul class="kw-modules">
			<?php foreach ( $kw_modules as $kw_module ) : ?>
				<li><b><?php echo esc_html( $kw_module ); ?></b></li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>

<section class="kw-band kw-band--sunk" id="watch">
	<div class="kw-shell kw-split kw-reveal">
		<figure class="kw-figure kw-figure--wide">
			<img src="<?php echo kingsword_image( 'community.jpg' ); ?>" alt="<?php esc_attr_e( 'Members greeting one another in the KingsWord Chicago sanctuary', 'kingsword-chicago' ); ?>" />
		</figure>
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'Watch', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( "Can't be in the room? Be in the room.", 'kingsword-chicago' ); ?></h2>
			</div>
			<p class="kw-lede">
				<?php esc_html_e( 'Every service streams live, and the full archive stays available on demand. If you are travelling, unwell, or still deciding whether to visit, start here.', 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--ink" href="https://www.youtube.com/@KingsWordEveryWhere"><?php esc_html_e( 'Watch on YouTube', 'kingsword-chicago' ); ?></a>
			</div>
		</div>
	</div>
</section>

<section class="kw-band" id="visit">
	<div class="kw-shell kw-split kw-reveal">
		<div>
			<div class="kw-section-head">
				<p class="kw-eyebrow"><?php esc_html_e( 'Plan a visit', 'kingsword-chicago' ); ?></p>
				<h2><?php esc_html_e( 'What Sunday actually looks like.', 'kingsword-chicago' ); ?></h2>
			</div>
			<p class="kw-lede">
				<?php esc_html_e( 'Park in the lot next to the building and come in through the main doors — someone will be there to meet you. Services run about ninety minutes. Children are welcome in the service or in KingsKids downstairs. Wear whatever you own.', 'kingsword-chicago' ); ?>
			</p>
			<div class="kw-actions">
				<a class="kw-btn kw-btn--ink" href="mailto:admin@kingsword.org"><?php esc_html_e( "Tell us you're coming", 'kingsword-chicago' ); ?></a>
			</div>
		</div>
		<dl class="kw-visit">
			<div>
				<dt><?php esc_html_e( 'Address', 'kingsword-chicago' ); ?></dt>
				<dd><?php esc_html_e( '4250 W Walton Street', 'kingsword-chicago' ); ?><br /><?php esc_html_e( 'Chicago, IL 60651', 'kingsword-chicago' ); ?></dd>
			</div>
			<div>
				<dt><?php esc_html_e( 'Phone', 'kingsword-chicago' ); ?></dt>
				<dd><a href="tel:+17732778701">+1 773 277 8701</a></dd>
			</div>
			<div>
				<dt><?php esc_html_e( 'Email', 'kingsword-chicago' ); ?></dt>
				<dd><a href="mailto:admin@kingsword.org">admin@kingsword.org</a></dd>
			</div>
			<div>
				<dt><?php esc_html_e( 'Children', 'kingsword-chicago' ); ?></dt>
				<dd><?php esc_html_e( 'Child care at every Sunday service', 'kingsword-chicago' ); ?></dd>
			</div>
		</dl>
	</div>
</section>
<!-- /wp:html -->

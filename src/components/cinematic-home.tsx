import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LocationGlobe } from "@/components/location-globe";
import { PublicNav } from "@/components/public-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ChurchVideos } from "@/components/church-videos";
import { LOCATION_MEDIA } from "@/lib/location-media";
import { LOCATIONS, locationHref, type PublicContext } from "@/lib/locations";

export function CinematicDirectory({ context }: { context: PublicContext }) {
  return (
    <div className="kw-location-grid">
      {LOCATIONS.map((location, index) => {
        const media = LOCATION_MEDIA[location.slug];
        return (
          <Link
            href={locationHref(location, context.customDomain)}
            className={`kw-location-card card-${location.slug}`}
            key={location.slug}
          >
            <Image
              src={media.hero.src}
              alt={media.hero.alt}
              fill
              sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 30vw"
            />
            <div className="kw-card-top">
              <span>{location.region}</span>
              <span>0{index + 1}</span>
            </div>
            <div className="kw-card-bottom">
              <p>{location.tagline}</p>
              <h3>{location.name}</h3>
              <span className="kw-round-arrow">
                <ArrowUpRight size={24} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function TrainingFeature() {
  return (
    <section className="kw-training">
      <div className="kw-shell kw-training-inner">
        <div>
          <p className="kw-kicker">YOUR NEXT CHAPTER</p>
          <h2>
            Go deeper.
            <br />
            <em>Grow stronger.</em>
          </h2>
          <p>
            Build a faith that goes with you. Our seven-module Believers
            Training programme is open to every location, at your own pace.
          </p>
          <Link
            href="/believers-training"
            className="kw-button kw-button-light"
          >
            Explore Believers Training <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="kw-training-list">
          {[
            "The New Covenant",
            "Identity in Christ",
            "The Word: The Agent of Change",
            "The Ministry of the Holy Spirit",
            "Spiritual Authority and Prayer",
            "Purpose and Calling",
            "Stewardship and Missional Lifestyle",
          ].map((title, i) => (
            <div key={title}>
              <span>0{i + 1}</span>
              <p>{title}</p>
              <ArrowUpRight size={16} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CinematicHome({ context }: { context: PublicContext }) {
  const locations = LOCATIONS.map((location) => ({
    slug: location.slug,
    name: location.name,
    region: location.region,
    href: locationHref(location, context.customDomain),
    coordinates: LOCATION_MEDIA[location.slug].coordinates,
    image: LOCATION_MEDIA[location.slug].hero.src,
    caption: LOCATION_MEDIA[location.slug].hero.alt,
    headline: LOCATION_MEDIA[location.slug].headline,
  }));
  return (
    <div className="kw-site">
      <PublicNav context={context} />
      <main id="main-content">
        <div className="kw-shell">
          <LocationGlobe locations={locations} />
        </div>
        <section className="kw-statement">
          <div className="kw-shell">
            <Reveal>
              <p className="kw-kicker">THIS IS KINGSWORD</p>
              <h2>
                Not just a place you go.
                <br />
                <span>A people you belong to.</span>
              </h2>
            </Reveal>
            <div className="kw-statement-bottom">
              <p>
                We are people of the Word and the Spirit. Across continents,
                cultures and generations, we are raising a supernatural army —
                equipped for purpose and bringing joy to our cities.
              </p>
              <Link className="kw-text-link" href="/about">
                Discover our story <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>
        </section>
        <section id="our-locations" className="kw-section">
          <div className="kw-shell">
            <div className="kw-section-heading">
              <div>
                <p className="kw-kicker">FIND YOUR FAMILY</p>
                <h2>
                  Somewhere near.
                  <br />
                  <em>Something greater.</em>
                </h2>
              </div>
              <p>
                Five destinations. One shared faith.
                <br />
                Choose a community and come as you are. <ArrowDown size={20} />
              </p>
            </div>
            <CinematicDirectory context={context} />
          </div>
        </section>
        <section className="kw-photo-statement">
          <Image
            src="/media/nigeria-prayer.jpg"
            alt="Worshippers praying at KingsWord Ikeja, Lagos"
            fill
            sizes="100vw"
          />
          <div className="kw-shell">
            <p className="kw-kicker">THE WORD. THE SPIRIT. YOUR PURPOSE.</p>
            <h2>
              There is more
              <br />
              <em>inside you.</em>
            </h2>
            <Link href="/locations" className="kw-button kw-button-light">
              Come and discover it <ArrowUpRight size={18} />
            </Link>
            <span className="kw-photo-credit">
              KingsWord Ikeja · Lagos, Nigeria
            </span>
          </div>
        </section>
        <section className="kw-section kw-watch">
          <div className="kw-shell">
            <div className="kw-section-heading">
              <div>
                <p className="kw-kicker">FAITH FOR YOUR EVERYDAY</p>
                <h2>
                  A message that stays.
                  <br />
                  <em>A worship that rises.</em>
                </h2>
              </div>
              <p>
                Experience the Word and the Spirit through teaching and worship
                from across our KingsWord family.
              </p>
            </div>
            <ChurchVideos
              videos={[
                LOCATION_MEDIA.chicago.videos[0],
                LOCATION_MEDIA.london.videos[1],
              ]}
            />
          </div>
        </section>
        <TrainingFeature />
      </main>
      <SiteFooter context={context} />
    </div>
  );
}

# KingsWord media sources

Researched September 8, 2026. The public website uses actual KingsWord photos
and videos from the ministry's published websites and channels. Local filenames
are editorial labels; they are not original media titles or event dates.

## Photography

The following fourteen source photographs are hosted in `public/media/` and
served through Next.js Image. Chicago's PNG was compressed to WebP at its
original dimensions; the other photographs retain their source formats.

| Local file | Published source |
| --- | --- |
| chicago-prayer.webp | [Chicago: BEN_4677-copy.png](https://chicago.kingsword.org/wp-content/uploads/2022/05/BEN_4677-copy.png) |
| chicago-community.jpg | [Chicago: LA5B2005.jpeg](https://chicago.kingsword.org/wp-content/uploads/2022/10/LA5B2005.jpeg) |
| chicago-worship.jpg | [Chicago: worship photograph](https://chicago.kingsword.org/wp-content/uploads/2024/03/PHOTO-2024-03-29-11-12-43-1.jpg) |
| nigeria-prayer.jpg | [KingsWord Ikeja: m1.jpg](https://www.kingswordikeja.org/images/m1.jpg) |
| nigeria-worship.jpg | [KingsWord Ikeja: m2.jpg](https://www.kingswordikeja.org/images/m2.jpg) |
| nigeria-service.jpg | [KingsWord Ikeja: event.jpg](https://www.kingswordikeja.org/images/event.jpg) |
| calgary-worship.webp | [KingsWord Canada: c6.webp](https://kingsword.ca/assets/c6.webp) |
| calgary-prayer.webp | [KingsWord Canada: c4.webp](https://kingsword.ca/assets/c4.webp) |
| calgary-choir.webp | [KingsWord Canada: c1.webp](https://kingsword.ca/assets/c1.webp) |
| dallas-community.jpg | [KingsWord Dallas: kwd-01.jpg](https://kingsworddallas.org/wp-content/uploads/2025/04/kwd-01.jpg) |
| dallas-prayer.jpg | [KingsWord Dallas: kwd-08-1.jpg](https://kingsworddallas.org/wp-content/uploads/2025/04/kwd-08-1.jpg) |
| london-worship.jpg | [KingsWord London: KAY00313](https://kingswordlondon.org/wp-content/uploads/2025/04/KAY00313-1500x630.jpg) |
| london-community.jpg | [KingsWord London: KAY00099](https://kingswordlondon.org/wp-content/uploads/2025/04/KAY00099-1030x1030.jpg) |
| london-family.jpg | [KingsWord London: KAY00463](https://kingswordlondon.org/wp-content/uploads/2025/04/KAY00463-845x684.jpg) |

The Calgary selection comes from the [official Calgary page](https://kingsword.ca/locations/calgary).
Nigeria's images show **KingsWord Ikeja, Lagos**, and are captioned accordingly.
Each local gallery uses photography from that local church, rather than
presenting another congregation as its own. The existing official ministry
wordmark is retained in `public/brand/logo-white.png`.

## Video library

Videos play on demand in YouTube's privacy-enhanced embedded player. Closing
the dialog removes the iframe and stops playback. Each player also links to
the original YouTube page. Thumbnail copies use the original video IDs and
YouTube's `https://i.ytimg.com/vi/{id}/maxresdefault.jpg` endpoint.

| Location / channel | Video |
| --- | --- |
| Chicago / KingsWord Everywhere | [Understanding Wholeness — Dr. Kay Ijisesan](https://www.youtube.com/watch?v=RpnOO6L2frs) |
| Chicago / KingsWord Everywhere | [Knowing You Possess Eternal Life — Dr. Kay Ijisesan](https://www.youtube.com/watch?v=8ZZ7fMjRnmA) |
| Nigeria / KingsWord Alagbado | [Praise Medley — H.O.P](https://www.youtube.com/watch?v=JnGecwBwapw) |
| Nigeria / KingsWord Alagbado | [Our God Is Greater — H.O.P](https://www.youtube.com/watch?v=atSaEKJPBxE) |
| Calgary / KingsWord Calgary | [Missionary Living](https://www.youtube.com/watch?v=5rBX18Mouk4) |
| Calgary / KingsWord Calgary | [Worship Night](https://www.youtube.com/watch?v=TfEzseQvbTE) |
| Dallas / KingsWord Dallas | [Developing the Spirit of Faith](https://www.youtube.com/watch?v=XABgiC2jMsE) |
| London / KingsWord London | [Grow, Part 2 — Pastor Emmy Akinlaja](https://www.youtube.com/watch?v=G3fwdcDR8qk) |
| London / KingsWord London | [Been So Good — KingsWord Worship cover](https://www.youtube.com/watch?v=g8U_9TkVwHA) |

Video IDs and channel attribution were verified against the official sites,
channels and YouTube metadata. The global homepage features selections from
KingsWord Everywhere and London. The Chicago selections are labeled as ministry
teaching, without claiming they were recorded at a particular Chicago service.
These are a curated library, not a live feed or a claim to be the latest videos.

## Globe geography

`public/geo/countries-110m.json` is the [World Atlas 2 countries dataset](https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json),
derived from public-domain Natural Earth geography. The [World Atlas repository](https://github.com/topojson/world-atlas)
documents the dataset and its ISC license. D3 Geo renders an orthographic
projection with coastlines, country borders and great-circle connections.

Points represent Chicago, Lagos (the Nigeria regional entry point), Calgary,
Dallas and London. Street directions use the separately published congregation
addresses in `src/lib/locations.ts`, not these city-centre globe coordinates.

The globe respects reduced motion, pauses automatically offscreen, supports
dragging, and provides keyboard-accessible selection, pause and reset controls.
All locations remain reachable through the photo directory if graphics or
JavaScript are unavailable.

## 4K Earth surface

- Local asset: `public/geo/earth-4k.webp` (4096 × 2048; 889,478 bytes).
- NASA Earth Observatory, Blue Marble Next Generation, July 2004; topography and bathymetry.
- Source: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/
- Original: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography-bathymetry/july/world.topo.bathy.200407.3x5400x2700.jpg
- Original 5400 × 2700 image resized and compressed as WebP; no invented geography. Rendered with a bright atmospheric rim and directional lighting.
- NASA media guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/

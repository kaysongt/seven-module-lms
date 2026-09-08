export type ChurchPhoto = { src: string; alt: string; source: string };
export type ChurchVideo = {
  id: string;
  title: string;
  category: string;
  channel: string;
};
export type LocationMedia = {
  coordinates: [number, number];
  accent: string;
  headline: string;
  heroLead: string;
  heroAccent: string;
  story: string;
  watchTitle: string;
  watchIntro: string;
  intro: string;
  hero: ChurchPhoto;
  photos: ChurchPhoto[];
  videos: ChurchVideo[];
};

const chicagoHero = {
  src: "/media/chicago-prayer.webp",
  alt: "The minister and congregation praying at KingsWord Chicago",
  source: "https://chicago.kingsword.org/",
};

export const LOCATION_MEDIA: Record<string, LocationMedia> = {
  chicago: {
    coordinates: [-87.6298, 41.8781],
    accent: "#245ce5",
    headline: "The Apostolic Place, Chicago.",
    heroLead: "Encounter God.",
    heroAccent: "Right here in Chicago.",
    intro:
      "Join us on the West Side for worship, the Word and a Sunday that makes room for you. Your first visit starts at 10 AM.",
    story:
      "At The Apostolic Place, teaching and prayer are at the centre of church life. Meet the people behind the welcome, worship with us and discover how to get involved.",
    watchTitle: "A closer look at the Word.",
    watchIntro:
      "Explore teaching from Dr. Kay Ijisesan, founder of KingsWord Ministries International.",
    hero: chicagoHero,
    photos: [
      {
        src: "/media/chicago-community.jpg",
        alt: "Smiling members of KingsWord Chicago",
        source: chicagoHero.source,
      },
      {
        src: "/media/chicago-worship.jpg",
        alt: "KingsWord Chicago worship team singing on stage",
        source: chicagoHero.source,
      },
      chicagoHero,
    ],
    videos: [
      {
        id: "RpnOO6L2frs",
        title: "Understanding Wholeness",
        category: "Dr. Kay Ijisesan · Unlimited 4.0",
        channel: "KingsWord Everywhere",
      },
      {
        id: "8ZZ7fMjRnmA",
        title: "Knowing You Possess Eternal Life",
        category: "Dr. Kay Ijisesan · Unlimited 3.0",
        channel: "KingsWord Everywhere",
      },
    ],
  },
  nigeria: {
    coordinates: [3.3792, 6.5244],
    accent: "#137b4a",
    headline: "From Lagos to Abuja and beyond.",
    heroLead: "A movement of faith.",
    heroAccent: "Across Nigeria.",
    intro:
      "Find KingsWord in your city. Explore our congregations, hear the worship and connect with the people who make each church home.",
    story:
      "Our churches in Nigeria bring the KingsWord message into their own neighbourhoods. Begin with a congregation near you, from Ikeja and Alagbado to Abuja and Ibadan.",
    watchTitle: "Turn up the praise.",
    watchIntro:
      "Hear H.O.P leading worship at KingsWord Alagbado, Lagos. Join in wherever you are.",
    hero: {
      src: "/media/nigeria-service.jpg",
      alt: "A service at KingsWord Ikeja, Lagos",
      source: "https://www.kingswordikeja.org/",
    },
    photos: [
      {
        src: "/media/nigeria-prayer.jpg",
        alt: "Congregation praying at KingsWord Ikeja, Lagos",
        source: "https://www.kingswordikeja.org/",
      },
      {
        src: "/media/nigeria-worship.jpg",
        alt: "Worship at KingsWord Ikeja, Lagos",
        source: "https://www.kingswordikeja.org/",
      },
      {
        src: "/media/nigeria-service.jpg",
        alt: "Teaching at KingsWord Ikeja, Lagos",
        source: "https://www.kingswordikeja.org/",
      },
    ],
    videos: [
      {
        id: "JnGecwBwapw",
        title: "Praise Medley",
        category: "H.O.P · Worship",
        channel: "KingsWord Alagbado",
      },
      {
        id: "atSaEKJPBxE",
        title: "Our God Is Greater",
        category: "H.O.P · Worship",
        channel: "KingsWord Alagbado",
      },
    ],
  },
  calgary: {
    coordinates: [-114.0719, 51.0447],
    accent: "#0879aa",
    headline: "A Sunday morning in southeast Calgary.",
    heroLead: "New city?",
    heroAccent: "Meet your community.",
    intro:
      "Whether Calgary is a new beginning or has always been home, join us for worship and teaching every Sunday at 9:30 AM.",
    story:
      "Led by Pastor Muyiwa Oseni, our Calgary church gathers in the southeast of the city. There is room to ask questions, build friendships and grow in your understanding of the Bible.",
    watchTitle: "Hear the heart of Calgary.",
    watchIntro:
      "Get a feel for our Sunday teaching and spend a little time in worship with the Calgary church.",
    hero: {
      src: "/media/calgary-worship.webp",
      alt: "The congregation worshipping at KingsWord Calgary",
      source: "https://kingsword.ca/locations/calgary",
    },
    photos: [
      {
        src: "/media/calgary-prayer.webp",
        alt: "KingsWord Calgary congregation in prayer",
        source: "https://kingsword.ca/locations/calgary",
      },
      {
        src: "/media/calgary-choir.webp",
        alt: "KingsWord Calgary choir leading worship",
        source: "https://kingsword.ca/locations/calgary",
      },
      {
        src: "/media/calgary-worship.webp",
        alt: "Raised hands during worship in Calgary",
        source: "https://kingsword.ca/locations/calgary",
      },
    ],
    videos: [
      {
        id: "5rBX18Mouk4",
        title: "Missionary Living",
        category: "Sunday teaching",
        channel: "KingsWord Calgary",
      },
      {
        id: "TfEzseQvbTE",
        title: "Worship Night",
        category: "Worship",
        channel: "KingsWord Calgary",
      },
    ],
  },
  dallas: {
    coordinates: [-96.8005, 32.7767],
    accent: "#b54326",
    headline: "Your Dallas-area church, gathering in Celina.",
    heroLead: "Make Sunday",
    heroAccent: "a fresh start.",
    intro:
      "Meet the KingsWord Dallas family in Celina. Doors open at 10:30 AM, with worship and teaching from 11 AM. Come and settle in.",
    story:
      "Pastors Dotun and Buki Oragbade lead a community where faith grows through the Word and relationships. Join a service, meet the team and discover church life in the Dallas area.",
    watchTitle: "Build a living faith.",
    watchIntro:
      "Watch a Sunday message from KingsWord Dallas on developing the spirit of faith.",
    hero: {
      src: "/media/dallas-community.jpg",
      alt: "KingsWord Dallas church family gathered outdoors",
      source: "https://kingsworddallas.org/",
    },
    photos: [
      {
        src: "/media/dallas-prayer.jpg",
        alt: "Prayer ministry at KingsWord Dallas",
        source: "https://kingsworddallas.org/",
      },
      {
        src: "/media/dallas-community.jpg",
        alt: "The KingsWord Dallas community under flowering trees",
        source: "https://kingsworddallas.org/",
      },
    ],
    videos: [
      {
        id: "XABgiC2jMsE",
        title: "Developing the Spirit of Faith",
        category: "Sunday teaching",
        channel: "KingsWord Dallas",
      },
    ],
  },
  london: {
    coordinates: [-0.1276, 51.5072],
    accent: "#743abb",
    headline: "The Graceland, in the heart of Charlton.",
    heroLead: "London moves fast.",
    heroAccent: "Make room for God.",
    intro:
      "Take a breath and join us at The Graceland in Charlton. Every Sunday at 10 AM, we gather to worship, hear the Word and reconnect.",
    story:
      "Led by Pastors Emmy and Kemi Akinlaja, KingsWord London brings people together at The Graceland. Discover the faces, music and teaching at the heart of this Charlton community.",
    watchTitle: "From The Graceland.",
    watchIntro:
      "Teaching with Pastor Emmy Akinlaja and worship from the KingsWord London family.",
    hero: {
      src: "/media/london-worship.jpg",
      alt: "The congregation gathered at KingsWord London",
      source: "https://kingswordlondon.org/",
    },
    photos: [
      {
        src: "/media/london-community.jpg",
        alt: "Smiling members of KingsWord London",
        source: "https://kingswordlondon.org/",
      },
      {
        src: "/media/london-family.jpg",
        alt: "Family life at KingsWord London",
        source: "https://kingswordlondon.org/",
      },
      {
        src: "/media/london-worship.jpg",
        alt: "Worshipping together at KingsWord London",
        source: "https://kingswordlondon.org/",
      },
    ],
    videos: [
      {
        id: "G3fwdcDR8qk",
        title: "Grow, Part 2",
        category: "Pastor Emmy Akinlaja",
        channel: "KingsWord London",
      },
      {
        id: "g8U_9TkVwHA",
        title: "Been So Good",
        category: "KingsWord Worship · Cover",
        channel: "KingsWord London",
      },
    ],
  },
};

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
    accent: "#e8bc7c",
    headline: "A place to be built up.",
    intro:
      "Rooted in Chicago. Reaching the world. Come for the Word, stay for the family, and discover what God has placed inside you.",
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
    accent: "#a9d0ad",
    headline: "Faith that moves a nation.",
    intro:
      "From Lagos to Abuja and beyond, find a family that will grow with you. Many congregations. One life-changing message.",
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
    accent: "#a6d4e6",
    headline: "Find your people. Find your purpose.",
    intro:
      "A warm welcome in a new city, a fresh beginning, a deeper faith. There is a place for you in our Calgary family.",
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
    accent: "#edb593",
    headline: "There is more ahead of you.",
    intro:
      "A family of faith in the Dallas area, making room for your story. Experience the Word, worship with us, and build a life of purpose.",
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
    accent: "#c4b4ed",
    headline: "A city of stories. A family for yours.",
    intro:
      "In the heart of Charlton, a community of faith is waiting to welcome you. Come as you are. Discover who you can become.",
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

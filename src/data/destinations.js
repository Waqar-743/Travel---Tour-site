// Import local images
import AttabadLakeHunza from '../assets/Attabad-Lake-Hunza.jpg';
import KachuraLakeSkardu from '../assets/Kachura-Lake-Skardu.jpg';
import AutumShigar from '../assets/Autum-Shigar.jpg';
import KhaplueFort from '../assets/Khaplu-Fort.jpg';

export const destinations = [
  {
    id: 1,
    name: "Hunza Valley",
    slug: "hunza-valley",
    image: AttabadLakeHunza,
    description: "Known as the 'Heaven on Earth', Hunza Valley offers breathtaking views of snow-capped peaks, ancient forts, and the warmest hospitality.",
    highlights: [
      "Karimabad",
      "Baltit Fort",
      "Eagle's Nest",
      "Attabad Lake"
    ],
    bestTime: "April - October",
    weather: {
      summer: { temp: "15-25°C", condition: "Pleasant" },
      winter: { temp: "-5 to 5°C", condition: "Cold & Snowy" },
      monsoon: { temp: "12-20°C", condition: "Occasional Rain" }
    },
    altitude: "2,438m",
    activities: ["Trekking", "Photography", "Cultural Tours", "Camping"]
  },
  {
    id: 2,
    name: "Skardu",
    slug: "skardu",
    image: KachuraLakeSkardu,
    description: "Gateway to the world's highest peaks, Skardu captivates with its turquoise lakes, vast plateaus, and majestic mountain ranges.",
    highlights: [
      "Shangrila Resort",
      "Deosai Plains",
      "Satpara Lake",
      "K2 Base Camp"
    ],
    bestTime: "May - September",
    weather: {
      summer: { temp: "10-22°C", condition: "Ideal" },
      winter: { temp: "-15 to 0°C", condition: "Harsh Cold" },
      monsoon: { temp: "8-18°C", condition: "Light Showers" }
    },
    altitude: "2,228m",
    activities: ["Mountaineering", "Lake Tours", "Wildlife", "Rock Climbing"]
  },
  {
    id: 3,
    name: "Shigar",
    slug: "shigar",
    image: AutumShigar,
    description: "Home to the beautifully restored Shigar Fort, this valley showcases the rich heritage and natural beauty of Baltistan.",
    highlights: [
      "Shigar Fort",
      "Cold Desert",
      "Ancient Mosques",
      "Traditional Villages"
    ],
    bestTime: "May - September",
    weather: {
      summer: { temp: "12-24°C", condition: "Warm & Dry" },
      winter: { temp: "-10 to 2°C", condition: "Very Cold" },
      monsoon: { temp: "10-20°C", condition: "Dry" }
    },
    altitude: "2,260m",
    activities: ["Heritage Tours", "Desert Jeep Safari", "Village Walks"]
  },
  {
    id: 4,
    name: "Khaplu",
    slug: "khaplu",
    image: KhaplueFort,
    description: "The gem of Baltistan, Khaplu enchants visitors with its stunning palace, ancient Chaqchan Mosque, and breathtaking mountain vistas.",
    highlights: [
      "Khaplu Palace",
      "Chaqchan Mosque",
      "Machulo Valley",
      "Thalle Valley"
    ],
    bestTime: "April - October",
    weather: {
      summer: { temp: "14-26°C", condition: "Pleasant" },
      winter: { temp: "-8 to 3°C", condition: "Cold" },
      monsoon: { temp: "12-22°C", condition: "Mild Rain" }
    },
    altitude: "2,600m",
    activities: ["Palace Tours", "Mosque Visit", "Valley Trekking", "Cultural Immersion"]
  }
];

export default destinations;

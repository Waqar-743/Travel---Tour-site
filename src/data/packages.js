// Import local images
import KhapluFort from '../assets/Khaplu-Fort.jpg';
import ShangrilaSkardu from '../assets/Shangerila-skardu.jpg';
import KhaplueBarah from '../assets/Khaplue-Barah.png';
import AutumShigar from '../assets/Autum-Shigar.jpg';
import DeosaiNationalPark from '../assets/Deosai-National-Park-Skardu.jpg';
import ChaqchanKhaplue from '../assets/Chaqchan-Khaplue.png';
import KhaplueAutum from '../assets/Khaplue-Autum.jpg';
import Khaplue from '../assets/Khaplue.jpg';
import KhaplueFort1 from '../assets/Khaplue-fort-1.png';
import KachuraLake from '../assets/Kachura-Lake-Skardu.jpg';
import AttabadLake from '../assets/Attabad-Lake-Hunza.jpg';
import SkarduCity from '../assets/Skardu-city-Night.jpg';
import Skardo from '../assets/Skardo.jpg';
import ShigarWaterfall from '../assets/Shigar-Waterfall.jpg';
import HunzaBaltiFort from '../assets/Hunza-Balti-Fort.png';
import ShigerHunza from '../assets/SHIGER-hUNZA.png';
import Spring from '../assets/Spring.jpg';
import SkarduManthal from '../assets/Skardu-Manthal.png';

export const packages = [
  {
    id: 1,
    name: "Khaplu Adventure",
    slug: "khaplu-adventure",
    duration: "4 Days / 3 Nights",
    price: 45000,
    difficulty: "Moderate",
    image: KhapluFort,
    highlights: [
      "Mountain trekking through scenic trails",
      "Visit traditional local villages",
      "Cultural immersion experience",
      "Explore ancient Chaqchan Mosque"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Orientation",
        description: "Arrive in Skardu, transfer to Khaplu. Evening orientation and welcome dinner with traditional Balti cuisine."
      },
      {
        day: 2,
        title: "Mountain Trek & Village Tour",
        description: "Morning trek to nearby peaks with stunning views. Afternoon visit to local villages and interact with warm-hearted locals."
      },
      {
        day: 3,
        title: "Cultural Exploration",
        description: "Visit the historic Chaqchan Mosque, one of the oldest in the region. Explore Khaplu Palace and local bazaar."
      },
      {
        day: 4,
        title: "Departure",
        description: "Breakfast and leisure time. Transfer back to Skardu for departure with unforgettable memories."
      }
    ],
    bestSeason: "June - September",
    groupSize: "2-8 persons",
    description: "Embark on an unforgettable adventure to Khaplu, the gem of Baltistan. This 4-day journey takes you through breathtaking mountain landscapes, ancient mosques, and vibrant local villages. Experience the warmth of Balti hospitality while trekking through some of the most scenic trails in Gilgit Baltistan.",
    included: [
      "All transportation from Skardu",
      "3 nights accommodation",
      "All meals (breakfast, lunch, dinner)",
      "Professional local guide",
      "Entrance fees to attractions",
      "First aid kit"
    ],
    notIncluded: [
      "Flight to Skardu",
      "Personal expenses",
      "Travel insurance",
      "Tips for guide and driver"
    ],
    whatToBring: [
      "Comfortable hiking shoes",
      "Warm layers and jacket",
      "Sunscreen and sunglasses",
      "Personal medications",
      "Camera",
      "Reusable water bottle"
    ],
    gallery: [
      ChaqchanKhaplue,
      KhaplueAutum,
      Khaplue,
      KhaplueFort1
    ]
  },
  {
    id: 2,
    name: "Skardu Expedition",
    slug: "skardu-expedition",
    duration: "6 Days / 5 Nights",
    price: 65000,
    difficulty: "Moderate-Hard",
    image: ShangrilaSkardu,
    highlights: [
      "Deosai National Park exploration",
      "Satpara Lake boat ride",
      "Introduction to mountaineering",
      "Shangrila Resort visit"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Skardu",
        description: "Arrive in Skardu via flight or road. Check-in at hotel and rest. Evening walk along the bazaar."
      },
      {
        day: 2,
        title: "Shangrila & Upper Kachura",
        description: "Visit the famous Shangrila Resort (Lower Kachura). Boat ride on the emerald lake. Explore Upper Kachura Lake."
      },
      {
        day: 3,
        title: "Deosai National Park",
        description: "Full day excursion to Deosai, the 'Land of Giants'. Wildlife spotting including Himalayan brown bear. Picnic lunch on the plains."
      },
      {
        day: 4,
        title: "Satpara Lake & Buddha Rock",
        description: "Morning visit to Satpara Lake. Explore the ancient Buddha Rock carving. Afternoon at leisure or optional short trek."
      },
      {
        day: 5,
        title: "Mountaineering Introduction",
        description: "Basic mountaineering skills workshop. Learn about equipment, safety, and techniques from expert guides."
      },
      {
        day: 6,
        title: "Departure",
        description: "Breakfast and checkout. Transfer to airport or start of return journey."
      }
    ],
    bestSeason: "July - August",
    groupSize: "2-6 persons",
    description: "Discover the majestic beauty of Skardu on this comprehensive 6-day expedition. From the otherworldly landscapes of Deosai to the serene waters of Satpara Lake, this journey offers a perfect blend of adventure and natural beauty. Learn basic mountaineering skills from experienced guides and create memories that last a lifetime.",
    included: [
      "All transportation within Skardu",
      "5 nights accommodation",
      "All meals",
      "Professional guide and support staff",
      "Deosai permit fees",
      "Mountaineering equipment for workshop",
      "First aid and emergency support"
    ],
    notIncluded: [
      "Flight to/from Skardu",
      "Personal expenses",
      "Travel insurance",
      "Alcoholic beverages",
      "Tips"
    ],
    whatToBring: [
      "Sturdy hiking boots",
      "Warm clothing (layers)",
      "Rain jacket",
      "Sun protection",
      "Personal first aid",
      "Camera with extra batteries"
    ],
    gallery: [
      KachuraLake,
      DeosaiNationalPark,
      Skardo,
      SkarduCity
    ]
  },
  {
    id: 3,
    name: "Khaplu Cultural Journey",
    slug: "khaplu-cultural-journey",
    duration: "3 Days / 2 Nights",
    price: 35000,
    difficulty: "Easy",
    image: KhaplueBarah,
    highlights: [
      "Historic Khaplu Palace",
      "Ancient Chaqchan Mosque",
      "Machulo & Thalle Valley",
      "Local handicraft workshops"
    ],
    itinerary: [
      {
        day: 1,
        title: "Journey to Khaplu",
        description: "Depart from Skardu to Khaplu. Stop at scenic viewpoints along Shyok River. Arrival and traditional welcome ceremony at heritage accommodation."
      },
      {
        day: 2,
        title: "Palace & Cultural Immersion",
        description: "Visit the magnificent Khaplu Palace (Yabgo Khar). Explore the 14th-century Chaqchan Mosque. Afternoon visit to local villages and handicraft workshops. Evening bonfire with local music."
      },
      {
        day: 3,
        title: "Valley Exploration & Return",
        description: "Morning excursion to Thalle Valley or Machulo. Enjoy panoramic mountain views. Return to Skardu with cherished memories."
      }
    ],
    bestSeason: "April - October",
    groupSize: "2-10 persons",
    description: "Experience the authentic culture of Baltistan on this 3-day cultural journey to Khaplu. Explore the stunning 19th-century Khaplu Palace, visit one of the oldest mosques in the region, and immerse yourself in the warm hospitality of local villages. Perfect for those seeking cultural depth without strenuous physical activity.",
    included: [
      "Transportation from Skardu",
      "2 nights heritage accommodation",
      "All meals (traditional cuisine)",
      "Cultural guide",
      "Palace & mosque entrance fees",
      "Welcome and farewell ceremonies"
    ],
    notIncluded: [
      "Travel to Skardu",
      "Personal shopping",
      "Travel insurance",
      "Tips"
    ],
    whatToBring: [
      "Comfortable walking shoes",
      "Light jacket",
      "Sun hat and sunscreen",
      "Camera",
      "Respect for local customs"
    ],
    gallery: [
      Spring,
      HunzaBaltiFort,
      AttabadLake,
      ShigarWaterfall
    ]
  },
  {
    id: 4,
    name: "Shigar Valley Explorer",
    slug: "shigar-valley-explorer",
    duration: "5 Days / 4 Nights",
    price: 55000,
    difficulty: "Moderate",
    image: AutumShigar,
    highlights: [
      "Historic Shigar Fort (Fong-Khar)",
      "Alpine meadows trekking",
      "Optional horseback riding",
      "Cold desert landscape exploration"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Shigar",
        description: "Transfer from Skardu to Shigar Valley. Check-in at heritage accommodation near Shigar Fort. Evening fort tour."
      },
      {
        day: 2,
        title: "Shigar Fort & Village",
        description: "Detailed exploration of the 17th-century Shigar Fort (Fong-Khar). Walk through Shigar village, visit ancient mosque and royal garden."
      },
      {
        day: 3,
        title: "Alpine Meadows Trek",
        description: "Day trek to nearby alpine meadows. Picnic lunch with mountain views. Optional horseback riding available."
      },
      {
        day: 4,
        title: "Cold Desert Adventure",
        description: "Explore the unique cold desert landscape. Visit local communities. Evening cultural program and traditional dinner."
      },
      {
        day: 5,
        title: "Departure",
        description: "Leisurely breakfast. Last-minute exploration or shopping. Transfer back to Skardu."
      }
    ],
    bestSeason: "May - September",
    groupSize: "2-8 persons",
    description: "Explore the enchanting Shigar Valley, home to one of Pakistan's most beautifully restored heritage sites - the Shigar Fort. This 5-day adventure combines history, nature, and adventure as you trek through alpine meadows, explore cold desert landscapes, and immerse yourself in centuries of Balti heritage.",
    included: [
      "All transportation",
      "4 nights accommodation (heritage property)",
      "All meals",
      "Professional guide",
      "Fort entrance fees",
      "Cultural program",
      "Trekking equipment"
    ],
    notIncluded: [
      "Travel to Skardu",
      "Horse riding (optional - PKR 3,000)",
      "Personal expenses",
      "Travel insurance",
      "Tips"
    ],
    whatToBring: [
      "Hiking boots",
      "Warm layers",
      "Sunscreen and hat",
      "Camera",
      "Personal medications",
      "Daypack"
    ],
    gallery: [
      ShigerHunza,
      ShigarWaterfall,
      SkarduManthal,
      Spring
    ]
  },
  {
    id: 5,
    name: "Astore High Altitude Trek",
    slug: "astore-high-altitude-trek",
    duration: "7 Days / 6 Nights",
    price: 85000,
    difficulty: "Hard",
    image: DeosaiNationalPark,
    highlights: [
      "High altitude trekking experience",
      "Pristine glacier exploration",
      "Nanga Parbat base camp views",
      "Extreme adventure challenge"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Acclimatization",
        description: "Arrive in Astore Valley. Rest and acclimatize to altitude. Briefing on trek ahead and equipment check."
      },
      {
        day: 2,
        title: "Trek to Base Camp 1",
        description: "Begin trek through pine forests. Gradual ascent to first base camp. Set up camp with mountain views."
      },
      {
        day: 3,
        title: "Glacier Approach",
        description: "Trek towards the glacier zone. Training on glacier walking techniques. Camp at higher altitude."
      },
      {
        day: 4,
        title: "Glacier Exploration",
        description: "Full day on the glacier. Explore ice formations and crevasses with safety equipment. Views of Nanga Parbat."
      },
      {
        day: 5,
        title: "Summit Day",
        description: "Early morning push to viewpoint summit. Panoramic views of Karakoram and Himalayan ranges. Descend to lower camp."
      },
      {
        day: 6,
        title: "Descent & Rest",
        description: "Trek back to Astore Valley. Celebration dinner. Rest and recovery."
      },
      {
        day: 7,
        title: "Departure",
        description: "Morning departure. Transfer to Gilgit or onward destination."
      }
    ],
    bestSeason: "June - August",
    groupSize: "2-5 persons",
    description: "Challenge yourself with this demanding 7-day high altitude trek in the Astore region. This adventure is designed for experienced trekkers seeking pristine glaciers, breathtaking views of Nanga Parbat, and the ultimate mountain experience. Push your limits in one of the most spectacular mountain regions on Earth.",
    included: [
      "All transportation",
      "6 nights accommodation (hotels + camping)",
      "All meals during trek",
      "Experienced mountain guide",
      "Porters and pack animals",
      "All camping and safety equipment",
      "Glacier equipment",
      "First aid and emergency support",
      "Permits"
    ],
    notIncluded: [
      "Travel to Astore",
      "Personal trekking gear",
      "Travel and evacuation insurance (mandatory)",
      "Personal expenses",
      "Tips"
    ],
    whatToBring: [
      "Technical hiking boots",
      "Warm sleeping bag",
      "Down jacket and layers",
      "Trekking poles",
      "Sunglasses (UV protection)",
      "High SPF sunscreen",
      "Personal first aid kit",
      "Energy snacks"
    ],
    gallery: [
      AttabadLake,
      HunzaBaltiFort,
      SkarduManthal,
      Skardo
    ]
  }
];

export default packages;

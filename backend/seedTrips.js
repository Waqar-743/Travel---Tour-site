const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trip = require('./models/Trip');
const Destination = require('./models/Destination');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Trip.deleteMany({});
    await Destination.deleteMany({});
    console.log('Cleared existing trips and destinations');

    // 1. Create Destination
    const skardu = await Destination.create({
      name: 'Skardu',
      slug: 'skardu',
      description: 'Skardu is a city located in Gilgit-Baltistan, Pakistan, and serves as the capital of Skardu District. Skardu is situated in the Skardu Valley, at the confluence of the Indus and Shigar Rivers.',
      country: 'Pakistan',
      region: 'Gilgit-Baltistan',
      city: 'Skardu',
      mainImage: '/assets/Skardu-city-Night.jpg'
    });
    console.log('Destination created:', skardu.name);

    // 2. Create Trips
    const packages = [
      {
        packageId: 1,
        name: "Khaplu Adventure",
        slug: "khaplu-adventure",
        destination: skardu._id,
        duration: { days: 4, nights: 3 },
        price: {
          amount: 45000,
          currency: 'PKR'
        },
        difficulty: "moderate",
        primaryImage: "/assets/Khaplu-Fort.jpg",
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
            description: "Arrive in Skardu, transfer to Khaplu. Evening orientation and welcome dinner with traditional Balti cuisine.",
            activities: [{ activity: "Arrival", description: "Arrival in Skardu" }]
          },
          {
            day: 2,
            title: "Mountain Trek & Village Tour",
            description: "Morning trek to nearby peaks with stunning views. Afternoon visit to local villages and interact with warm-hearted locals.",
            activities: [{ activity: "Trek", description: "Morning trek" }]
          },
          {
            day: 3,
            title: "Cultural Exploration",
            description: "Visit the historic Chaqchan Mosque, one of the oldest in the region. Explore Khaplu Palace and local bazaar.",
            activities: [{ activity: "Tour", description: "Visit Mosque" }]
          },
          {
            day: 4,
            title: "Departure",
            description: "Breakfast and leisure time. Transfer back to Skardu for departure with unforgettable memories.",
            activities: [{ activity: "Departure", description: "Transfer to airport" }]
          }
        ],
        bestSeason: "June - September",
        groupSize: { min: 2, max: 8 },
        description: "Embark on an unforgettable adventure to Khaplu, the gem of Baltistan. This 4-day journey takes you through breathtaking mountain landscapes, ancient mosques, and vibrant local villages. Experience the warmth of Balti hospitality while trekking through some of the most scenic trails in Gilgit Baltistan.",
        inclusions: [
          "All transportation from Skardu",
          "3 nights accommodation",
          "All meals (breakfast, lunch, dinner)",
          "Professional local guide",
          "Entrance fees to attractions",
          "First aid kit"
        ],
        exclusions: [
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
          "/assets/Chaqchan-Khaplue.png",
          "/assets/Khaplue-Autum.jpg",
          "/assets/Khaplue.jpg",
          "/assets/Khaplue-fort-1.png"
        ],
        status: 'active',
        availableDates: [
            { departureDate: new Date('2025-06-01'), returnDate: new Date('2025-06-05'), spotsAvailable: 20 },
            { departureDate: new Date('2025-07-01'), returnDate: new Date('2025-07-05'), spotsAvailable: 20 }
        ],
        maxCapacity: 20,
        currentBookings: 0
      },
      {
        packageId: 2,
        name: "Skardu Expedition",
        slug: "skardu-expedition",
        destination: skardu._id,
        duration: { days: 6, nights: 5 },
        price: {
            amount: 65000,
            currency: 'PKR'
        },
        difficulty: "challenging",
        primaryImage: "/assets/Shangerila-skardu.jpg",
        highlights: [
          "Deosai National Park exploration",
          "Satpara Lake boat ride"
        ],
        itinerary: [
          { day: 1, title: "Arrival", description: "Arrival in Skardu", activities: [{ activity: "Arrival" }] },
          { day: 2, title: "Deosai", description: "Trip to Deosai Plains", activities: [{ activity: "Tour" }] }
        ],
        description: "Experience the magic of Skardu with this comprehensive expedition. Visit the world-famous Deosai National Park, the second-highest plateau in the world, known as the Land of Giants. Enjoy serene boat rides on Satpara Lake and witness the majestic beauty of the Karakoram range. This tour is perfect for adventure seekers and nature lovers alike.",
        inclusions: ["Transport", "Hotel"],
        exclusions: ["Flights"],
        whatToBring: ["Warm clothes"],
        status: 'active',
        availableDates: [
            { departureDate: new Date('2025-06-15'), returnDate: new Date('2025-06-21'), spotsAvailable: 15 }
        ],
        maxCapacity: 15,
        currentBookings: 0
      }
    ];

    await Trip.insertMany(packages);
    console.log('Trips seeded successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

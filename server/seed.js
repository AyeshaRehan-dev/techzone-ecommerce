require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('./Product');

const sampleProducts = [
  // Laptops
  {
    name: 'Apple MacBook Pro 14"',
    price: 1999.00,
    brand: 'Apple',
    category: 'Laptops',
    imageURL: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    description: 'Supercharged by M3 Pro, MacBook Pro takes its power and efficiency further than ever. Features a Liquid Retina XDR display.'
  },
  {
    name: 'Dell XPS 15',
    price: 2299.00,
    brand: 'Dell',
    category: 'Laptops',
    imageURL: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=60',
    description: 'Stunning 4K OLED display with ultra-thin bezels. The ultimate laptop for creators and power users.'
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    price: 1599.00,
    brand: 'ASUS',
    category: 'Laptops',
    imageURL: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=60',
    description: 'The world\'s most powerful 14-inch gaming laptop with Ryzen 9 and RTX 40-series graphics.'
  },
  // Mobiles
  {
    name: 'iPhone 15 Pro Max',
    price: 1199.00,
    brand: 'Apple',
    category: 'Mobiles',
    imageURL: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop&q=60',
    description: 'Titanium design, A17 Pro chip, and the most advanced camera system on an iPhone.'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299.00,
    brand: 'Samsung',
    category: 'Mobiles',
    imageURL: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60',
    description: 'Galaxy AI is here. The ultimate Android experience with S-Pen, 200MP camera, and titanium frame.'
  },
  {
    name: 'Google Pixel 8 Pro',
    price: 999.00,
    brand: 'Google',
    category: 'Mobiles',
    imageURL: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=60',
    description: 'The best of Google AI. Incredible camera features and 7 years of software updates.'
  },
  // Audio
  {
    name: 'Sony WH-1000XM5',
    price: 348.00,
    brand: 'Sony',
    category: 'Audio',
    imageURL: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60',
    description: 'Industry-leading noise canceling headphones with Auto NC Optimizer and exceptional sound quality.'
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    price: 249.00,
    brand: 'Apple',
    category: 'Audio',
    imageURL: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800&auto=format&fit=crop&q=60',
    description: 'Magic like you\'ve never heard. Active Noise Cancellation and Personalized Spatial Audio.'
  },
  {
    name: 'Bose QuietComfort Ultra',
    price: 429.00,
    brand: 'Bose',
    category: 'Audio',
    imageURL: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60',
    description: 'World-class noise cancellation, world-class sound. Breakthrough spatialized audio.'
  },
  // Accessories
  {
    name: 'Logitech MX Master 3S',
    price: 99.00,
    brand: 'Logitech',
    category: 'Accessories',
    imageURL: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60',
    description: 'Advanced wireless mouse with ultra-fast scrolling and ergonomic design.'
  },
  {
    name: 'Keychron K2 V2',
    price: 89.00,
    brand: 'Keychron',
    category: 'Accessories',
    imageURL: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=60',
    description: 'Compact wireless mechanical keyboard with Gateron switches and RGB backlight.'
  },
  {
    name: 'Razer Goliathus Extended',
    price: 59.00,
    brand: 'Razer',
    category: 'Accessories',
    imageURL: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60',
    description: 'Oversized soft gaming mouse mat powered by Razer Chroma RGB lighting.'
  },
  // Monitors & TVs
  {
    name: 'Samsung 49" Odyssey G9',
    price: 1399.00,
    brand: 'Samsung',
    category: 'Monitors',
    imageURL: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60',
    description: '1000R curved gaming monitor with 240Hz refresh rate and G-Sync compatibility.'
  },
  {
    name: 'LG C3 42" OLED TV',
    price: 1199.00,
    brand: 'LG',
    category: 'Displays',
    imageURL: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=60',
    description: 'Infinite contrast and perfect black. Perfect for gaming with HDMI 2.1 and G-Sync.'
  },
  {
    name: 'Dell UltraSharp 27" 4K',
    price: 599.00,
    brand: 'Dell',
    category: 'Monitors',
    imageURL: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&auto=format&fit=crop&q=60',
    description: 'Color accuracy and clarity for professionals. USB-C hub functionality included.'
  },
  // Tablets & Others
  {
    name: 'iPad Pro 12.9" M2',
    price: 1099.00,
    brand: 'Apple',
    category: 'Tablets',
    imageURL: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
    description: 'The ultimate iPad experience. Liquid Retina XDR display and M2 performance.'
  },
  {
    name: 'Nintendo Switch OLED',
    price: 349.00,
    brand: 'Nintendo',
    category: 'Gaming',
    imageURL: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop&q=60',
    description: 'Vibrant 7-inch OLED screen and enhanced audio for gaming on the go.'
  },
  {
    name: 'PlayStation 5 Slim',
    price: 499.00,
    brand: 'Sony',
    category: 'Gaming',
    imageURL: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=60',
    description: 'Play Has No Limits. Experience lightning-fast loading and immersive 3D audio.'
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany();
    console.log('Existing products cleared.');

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted perfectly!');

    // Close the connection
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

seedDB();

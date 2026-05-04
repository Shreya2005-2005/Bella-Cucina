require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'restaurant-secret-key',
  resave: false,
  saveUninitialized: false
}));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Data storage
const dataPath = './data';
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
if (!fs.existsSync('public/uploads')) fs.mkdirSync('public/uploads', { recursive: true });

// Initialize data files
const initData = () => {
  const files = {
    'settings.json': {
      restaurantName: 'Bella Cucina',
      restaurantType: 'Italian Fine Dining',
      tagline: 'Authentic Italian Cuisine in the Heart of the City',
      about: 'Welcome to Bella Cucina, where tradition meets innovation...',
      chefName: 'Chef Marco Rossi',
      chefBio: 'With over 20 years of culinary experience...',
      phone: '+1 (555) 123-4567',
      email: 'info@bellacucina.com',
      address: '123 Main Street, Downtown',
      hours: 'Mon-Thu: 11am-10pm | Fri-Sat: 11am-11pm | Sun: 12pm-9pm',
      socialLinks: { facebook: '#', instagram: '#', twitter: '#' },
      colors: { primary: '#d4af37', secondary: '#2c3e50', accent: '#e74c3c' },
      fonts: { heading: 'Playfair Display', body: 'Lato' }
    },
    'menu.json': [
      { id: 1, name: 'Margherita Pizza', category: 'Mains', price: 18, description: 'Fresh mozzarella, basil, tomato sauce', image: '/images/dish1.jpg', featured: true },
      { id: 2, name: 'Spaghetti Carbonara', category: 'Mains', price: 22, description: 'Creamy pasta with pancetta and parmesan', image: '/images/dish2.jpg', featured: true },
      { id: 3, name: 'Tiramisu', category: 'Desserts', price: 10, description: 'Classic Italian coffee-flavored dessert', image: '/images/dish3.jpg', featured: true }
    ],
    'testimonials.json': [
      { id: 1, name: 'Sarah Johnson', rating: 5, text: 'Amazing food and atmosphere! Best Italian restaurant in town.', date: '2024-04-15' },
      { id: 2, name: 'Michael Chen', rating: 5, text: 'The pasta is incredible. Highly recommend!', date: '2024-04-10' }
    ],
    'reservations.json': [],
    'contacts.json': [],
    'posts.json': [],
    'faqs.json': [
      { id: 1, question: 'Do you accommodate dietary restrictions?', answer: 'Yes, we offer vegetarian, vegan, and gluten-free options.' },
      { id: 2, question: 'Is parking available?', answer: 'Yes, we have valet parking and a nearby parking garage.' }
    ]
  };

  Object.entries(files).forEach(([file, data]) => {
    const filePath = path.join(dataPath, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
  });
};

initData();

// Helper functions
const readData = (file) => JSON.parse(fs.readFileSync(path.join(dataPath, file), 'utf8'));
const writeData = (file, data) => fs.writeFileSync(path.join(dataPath, file), JSON.stringify(data, null, 2));

// Auth middleware
const isAuth = (req, res, next) => {
  if (req.session.isAdmin) return next();
  res.redirect('/admin/login');
};

// Email transporter (optional - configure when needed)
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransporter({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
// });

// Routes - Frontend
app.get('/', (req, res) => {
  const settings = readData('settings.json');
  const menu = readData('menu.json');
  const testimonials = readData('testimonials.json');
  const faqs = readData('faqs.json');
  const featuredDishes = menu.filter(item => item.featured);
  res.render('index', { settings, menu, testimonials, faqs, featuredDishes });
});

app.post('/reservation', (req, res) => {
  const reservations = readData('reservations.json');
  const newReservation = { id: Date.now(), ...req.body, date: new Date().toISOString() };
  reservations.push(newReservation);
  writeData('reservations.json', reservations);
  res.json({ success: true, message: 'Reservation request received!' });
});

app.post('/contact', (req, res) => {
  const contacts = readData('contacts.json');
  const newContact = { id: Date.now(), ...req.body, date: new Date().toISOString() };
  contacts.push(newContact);
  writeData('contacts.json', contacts);
  res.json({ success: true, message: 'Message sent successfully!' });
});

// Admin Routes
app.get('/admin/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Invalid credentials' });
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.get('/admin', isAuth, (req, res) => {
  const settings = readData('settings.json');
  const menu = readData('menu.json');
  const reservations = readData('reservations.json');
  const contacts = readData('contacts.json');
  res.render('admin/dashboard', { settings, menu, reservations, contacts });
});

app.get('/admin/menu', isAuth, (req, res) => {
  const menu = readData('menu.json');
  res.render('admin/menu', { menu });
});

app.post('/admin/menu', isAuth, upload.single('image'), (req, res) => {
  const menu = readData('menu.json');
  const newItem = {
    id: Date.now(),
    name: req.body.name,
    category: req.body.category,
    price: parseFloat(req.body.price),
    description: req.body.description,
    image: req.file ? `/uploads/${req.file.filename}` : '/uploads/placeholder.jpg',
    featured: req.body.featured === 'on'
  };
  menu.push(newItem);
  writeData('menu.json', menu);
  res.redirect('/admin/menu');
});

app.post('/admin/menu/delete/:id', isAuth, (req, res) => {
  let menu = readData('menu.json');
  menu = menu.filter(item => item.id != req.params.id);
  writeData('menu.json', menu);
  res.json({ success: true });
});

app.get('/admin/settings', isAuth, (req, res) => {
  const settings = readData('settings.json');
  res.render('admin/settings', { settings });
});

app.post('/admin/settings', isAuth, (req, res) => {
  const settings = readData('settings.json');
  Object.assign(settings, req.body);
  writeData('settings.json', settings);
  res.redirect('/admin/settings');
});

app.get('/admin/posts', isAuth, (req, res) => {
  const posts = readData('posts.json');
  res.render('admin/posts', { posts });
});

app.post('/admin/posts', isAuth, upload.single('image'), (req, res) => {
  const posts = readData('posts.json');
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    date: new Date().toISOString()
  };
  posts.push(newPost);
  writeData('posts.json', posts);
  res.redirect('/admin/posts');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

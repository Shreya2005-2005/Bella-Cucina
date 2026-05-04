# Restaurant Website - Full-Stack Solution

A modern, high-converting restaurant website with a complete admin dashboard for managing content, menu, reservations, and design customization.

## Features

### Frontend
- **Hero Section** with signature dish imagery and call-to-action
- **About Section** with restaurant story and chef introduction
- **Menu Section** with categories, images, and prices
- **Featured Dishes** showcase
- **Reservation System** with form submission
- **Testimonials** and reviews display
- **FAQ Section** for common questions
- **Contact Section** with location and hours
- **Fully Responsive** mobile-first design
- **SEO Optimized** structure

### Admin Dashboard
- **Menu Manager** - Add, edit, delete menu items with images
- **Reservation Management** - View and manage table bookings
- **Contact Form Submissions** - Track customer inquiries
- **Blog/Posts CMS** - Create announcements and events
- **Settings Panel** - Edit all website content
- **Design Customization** - Change colors, fonts, and layout
- **Media Library** - Upload and manage images
- **Opening Hours Editor**

## Installation

1. **Clone or download this project**

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Edit `.env` file with your settings:**
```
ADMIN_EMAIL=admin@restaurant.com
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=your-random-secret-key
```

5. **Start the server:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

6. **Access the website:**
- Frontend: http://localhost:5000
- Admin Panel: http://localhost:5000/admin/login

## Default Admin Credentials
- Email: admin@restaurant.com
- Password: admin123

**⚠️ IMPORTANT: Change these credentials in your .env file before deploying!**

## Project Structure

```
restaurant-website/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── data/                 # JSON data storage
│   ├── settings.json     # Website settings
│   ├── menu.json         # Menu items
│   ├── reservations.json # Reservations
│   ├── contacts.json     # Contact submissions
│   ├── posts.json        # Blog posts
│   └── faqs.json         # FAQ items
├── views/                # EJS templates
│   ├── index.ejs         # Frontend homepage
│   └── admin/            # Admin dashboard views
├── public/               # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── images/           # Images
│   └── uploads/          # User uploaded files
```

## Customization

### Change Restaurant Information
1. Login to admin panel at `/admin/login`
2. Go to **Settings**
3. Update restaurant name, tagline, about text, contact info
4. Save changes

### Manage Menu
1. Go to **Menu Manager** in admin
2. Add new items with name, category, price, description, and image
3. Mark items as "Featured" to show on homepage
4. Delete or edit existing items

### Design Customization
1. Go to **Settings** in admin
2. Scroll to **Design Customization**
3. Change primary, secondary, and accent colors
4. Changes apply immediately to the website

### Add Blog Posts
1. Go to **Blog & Posts** in admin
2. Create new posts with title, content, and optional image
3. Posts can be used for announcements, events, or news

## Deployment

### Deploy to Production

1. **Set up a production server** (VPS, cloud hosting, etc.)

2. **Install Node.js** on your server

3. **Upload files** to your server

4. **Install dependencies:**
```bash
npm install --production
```

5. **Set environment variables** for production

6. **Use a process manager** like PM2:
```bash
npm install -g pm2
pm2 start server.js --name restaurant-website
pm2 save
pm2 startup
```

7. **Set up a reverse proxy** (Nginx/Apache) for port 80/443

8. **Configure SSL certificate** (Let's Encrypt recommended)

## Technologies Used

- **Backend:** Node.js, Express.js
- **Template Engine:** EJS
- **File Upload:** Multer
- **Session Management:** express-session
- **Email:** Nodemailer
- **Frontend:** Vanilla JavaScript, CSS3, HTML5
- **Data Storage:** JSON files (easily upgradeable to MongoDB/PostgreSQL)

## Support & Customization

This is a production-ready template that can be customized further based on your specific needs:
- Integration with payment gateways
- Online ordering system
- Table availability calendar
- Email notifications for reservations
- Database integration (MongoDB, PostgreSQL)
- Multi-language support
- Advanced analytics

## License

This project is provided as-is for commercial and personal use.

## Security Notes

- Change default admin credentials immediately
- Use strong session secrets
- Enable HTTPS in production
- Regularly update dependencies
- Implement rate limiting for forms
- Add CSRF protection for production use

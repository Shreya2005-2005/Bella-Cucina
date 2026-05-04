# Deployment Guide for Vercel

## Environment Variables

Before deploying to Vercel, you need to set these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

```
PORT=5000
SESSION_SECRET=your-random-secret-key-here
ADMIN_EMAIL=admin@restaurant.com
ADMIN_PASSWORD=your-secure-password
```

## Important Notes

⚠️ **Data Persistence**: This app uses JSON files for data storage. On Vercel (serverless), data will be stored in `/tmp` which is ephemeral and will be cleared between deployments.

### For Production Use:

**Option 1: Use a Database (Recommended)**
- Migrate to MongoDB, PostgreSQL, or another database
- Update the data storage logic in `server.js`

**Option 2: Use Vercel KV or Vercel Postgres**
- Integrate Vercel's storage solutions
- Update data handling accordingly

**Option 3: Deploy to a Traditional Server**
- Use platforms like Railway, Render, or DigitalOcean
- These support persistent file storage

## Deployment Steps

1. Install Vercel CLI (optional):
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

4. Redeploy if needed:
```bash
vercel --prod
```

## Alternative Deployment Platforms

### Railway.app (Recommended for this app)
- Supports persistent storage
- Easy deployment
- Free tier available

### Render.com
- Supports persistent storage
- Free tier available
- Good for Node.js apps

### Heroku
- Traditional hosting
- Persistent storage
- Paid plans available

## Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong SESSION_SECRET
- [ ] Enable HTTPS
- [ ] Set secure cookie options in production
- [ ] Add rate limiting
- [ ] Implement CSRF protection

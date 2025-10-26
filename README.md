# sustain-eco

SustainEco Systems & Services - A modern, full-stack web application for sustainable urban solutions.

## Features

- 🌍 Modern responsive design with React + Vite
- 🎨 Beautiful UI with Tailwind CSS and Framer Motion
- 🔐 Admin panel with Supabase authentication
- 📊 Dynamic content management system
- 🖼️ Image upload and management
- 🗺️ Interactive India map visualization
- 📱 Fully responsive across all devices

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database + Storage + Auth)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Maps**: D3.js with TopoJSON

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Manishgupta-coder/sustain-eco.git
cd sustain-eco
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase database
Run the SQL commands in `supabase-setup.sql` in your Supabase SQL Editor

5. Start development server
```bash
npm run dev
```

## Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   │   └── admin/       # Admin panel pages
│   ├── supabase/        # Supabase configuration
│   └── assets/          # Static assets
├── public/              # Public assets
└── supabase-setup.sql   # Database setup script
```

## Admin Panel

Access the admin panel at `/admin/login`

Features:
- Hero section management with image uploads
- Content management for all sections
- User management
- Analytics dashboard
- Settings configuration

## Deployment

Build for production:
```bash
npm run build
```

The build output will be in the `dist/` directory.

## License

MIT License
# sustain-eco

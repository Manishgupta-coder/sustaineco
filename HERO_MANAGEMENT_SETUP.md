# Hero Section Management Setup

## Supabase Database Setup

### Step 1: Run SQL in Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase-setup.sql`
5. Click **Run** to execute

This will:
- Create the `hero_slides` table
- Set up Row Level Security policies
- Insert 3 default hero slides

### Step 2: Verify Table Creation

1. Go to **Table Editor** in Supabase
2. You should see the `hero_slides` table
3. It should contain 3 default slides

## Features

### Admin Panel - Hero Management

Access at: `/admin/content/hero`

**Features:**
- ✅ View all hero slides
- ✅ Add new slides
- ✅ Edit existing slides
- ✅ Delete slides
- ✅ Set custom gradient colors
- ✅ Control slide order
- ✅ Real-time updates

**Fields:**
- **Title**: Main heading text
- **Description**: Subtitle/description text
- **Gradient Start**: Starting color of background gradient
- **Gradient End**: Ending color of background gradient
- **Order Index**: Display order (0 = first)

### Frontend Integration

The Hero Section on the homepage automatically:
- Fetches slides from Supabase
- Displays them in order
- Rotates through slides every 5 seconds
- Uses custom gradient colors set in admin

## How to Use

### 1. Login to Admin Panel
```
Navigate to: /admin/login
Login with your Supabase credentials
```

### 2. Access Hero Management
```
Click: Content (in sidebar)
Click: Hero Section
```

### 3. Add/Edit Slides
- Click "Add New Slide" button
- Fill in title and description
- Choose gradient colors using color pickers
- Set order index
- Click "Create Slide"

### 4. Edit Existing Slides
- Click the edit icon (pencil) on any slide
- Modify fields
- Click "Update Slide"

### 5. Delete Slides
- Click the delete icon (trash) on any slide
- Confirm deletion

## Database Schema

```sql
hero_slides
├── id (UUID, Primary Key)
├── title (TEXT, Required)
├── description (TEXT, Required)
├── gradient_start (TEXT, Default: '#0073E6')
├── gradient_end (TEXT, Default: '#2EB82E')
├── order_index (INTEGER, Default: 0)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Security

- **Public Read**: Anyone can view slides on the website
- **Authenticated Write**: Only logged-in admins can create/update/delete
- Row Level Security (RLS) is enabled

## Troubleshooting

### Slides not showing on homepage?
1. Check Supabase connection in `.env`
2. Verify table exists in Supabase
3. Check browser console for errors
4. Ensure at least one slide exists in database

### Can't add/edit slides?
1. Verify you're logged in to admin panel
2. Check Supabase RLS policies
3. Verify your user is authenticated in Supabase

### Gradients not displaying correctly?
1. Use valid hex color codes (e.g., #0073E6)
2. Both gradient_start and gradient_end must be set
3. Clear browser cache and refresh

## Next Steps

To add more content management sections:
1. Create similar tables in Supabase
2. Add routes in `AdminLayout.jsx` dropdown
3. Create management pages like `HeroManagement.jsx`
4. Update frontend components to fetch from Supabase

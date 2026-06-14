# 🎵 Spotify Clone (Fullstack Next.js)

Welcome to the **Spotify Clone** repository! This is a full-stack music streaming application built to mimic the core functionalities of Spotify, featuring a modern UI, audio playback, song uploads, liked songs, and premium subscriptions.

## ✨ Features

- **Audio Player:** Play, pause, skip, and adjust volume with a custom global player.
- **Song Upload:** Users can upload their own MP3 files and cover images.
- **Library & Liked Songs:** Save your favorite tracks and build a personal library.
- **Search System:** Search for songs by title in real-time.
- **Authentication:** Secure login and registration using Supabase Auth (Email, GitHub, etc.).
- **Premium Subscriptions:** Stripe integration for premium plans and checkout.
- **Responsive Design:** Fully responsive UI built with Tailwind CSS, supporting mobile and desktop.
- **Category Filtering:** Filter songs by Music, Podcast, etc.

## 🛠️ Technologies Used

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Payments:** [Stripe](https://stripe.com/)
- **State Management:** Zustand
- **Form Handling:** React Hook Form & yup
- **UI Components:** Radix UI, React Icons

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/spotify-clone.git
cd spotify-clone
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup environment variables
Create a `.env.local` file in the root directory and add the following variables. You will need to get these from your Supabase and Stripe dashboards.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Setup Database (Supabase)
You need to set up the database schema in Supabase. You can find the SQL migrations or tables needed for `users`, `songs`, `liked_songs`, `products`, `prices`, and `subscriptions`.

### 5. Run the development server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/spotify-clone/issues).

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

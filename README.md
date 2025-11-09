# Kitchen Social - Mobile App

A social-first mobile cooking app where people share what they're cooking, how they're saving money, and how they're using leftovers. Powered by an inventory system, AI recipes, and grocery lists.

## Features

### Social Features (Front Stage)
- **Feed**: Infinite scroll of posts from people you follow and recommended content
- **Create Posts**: Share meals, fridge/pantry updates, or tips with optional recipe attachments
- **Explore**: Discover trending budget meals, zero-waste pros, and most re-cooked recipes
- **Profiles**: View user stats, posts, recipes, and badges
- **Social Actions**: Like, comment, and re-cook recipes from the feed

### Utility Features (Backstage)
- **Inventory Management**: Track items in fridge, freezer, and pantry with expiry alerts
- **AI Recipe Generator**: Generate personalized recipes based on your inventory
- **Meal Planning**: Plan your week with recipes and track what you've cooked
- **Grocery Lists**: Smart shopping lists that respect your inventory

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **PWA-ready** with Vite PWA plugin

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

3. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
pnpm build
```

The built files will be in the `dist` directory, ready to be deployed as a PWA.

## Mobile Optimization

The app is designed mobile-first with:
- Bottom tab navigation (native app feel)
- Touch-friendly targets (minimum 44x44px)
- Safe area insets for notched devices
- Responsive layouts optimized for phones
- PWA manifest for installable app experience

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Main app screens
├── layouts/         # Layout components
├── store/          # Zustand state management
├── types/           # TypeScript type definitions
├── lib/             # Utility functions
└── main.tsx         # App entry point
```

## Key Screens

- **FeedScreen**: Main social feed with posts
- **CreatePostScreen**: Post creation with media, recipes, and stats
- **KitchenScreen**: Hub for inventory, AI recipes, meal plan, and grocery list
- **ProfileScreen**: User profile with stats and posts
- **ExploreScreen**: Discover trending content and topics
- **PostDetailScreen**: Full post view with comments
- **RecipeDetailScreen**: Recipe details with ingredients and steps

## Features in Detail

### Post Types
1. **Meal Posts**: Share what you cooked with recipe and stats
2. **Fridge/Pantry Posts**: Before & after photos of your inventory
3. **Tip Posts**: Share cooking tips, hacks, or reviews

### Stats & Metrics
- Cost per serving (auto-calculated from inventory)
- Waste saved (tracks expiring items used)
- Expiring items used count
- Auto-generated badges (NO-WASTE, UNDER-$3, etc.)

### AI Recipe Generator
- Analyzes your inventory
- Prioritizes expiring items
- Generates personalized recipes
- Estimates cost and waste saved

## Development Notes

- The app uses mock data for demonstration
- In production, you'll need to connect to backend APIs
- Image uploads are simulated (use actual file upload in production)
- Camera/receipt scanning is placeholder (integrate with device APIs)

## License

MIT


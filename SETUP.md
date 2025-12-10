# Quick Setup Guide

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- TypeScript
- Vite
- React Router
- Firebase
- Tailwind CSS
- And more...

### Step 2: Copy Images (if needed)

The images should already be in the `public/RideShare/imge/` folder. If they're not, copy them:

```bash
cp -r RideShare/imge/* public/RideShare/imge/
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 4: Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 📁 Important Notes

1. **Firebase Configuration**: Already configured in `src/config/firebase.ts`
2. **Images**: Static assets should be in the `public` folder
3. **Old Files**: The original HTML/JS files are preserved in `RideShare/` and `RideShare-js/` folders
4. **TypeScript**: All new code is in TypeScript for better type safety

## 🔧 Troubleshooting

### Port Already in Use
If port 3000 is busy, change it in `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change to any available port
}
```

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.

### Firebase Errors
Make sure your Firebase project is active and the configuration in `src/config/firebase.ts` is correct.

## 🎯 Next Steps

1. Test the authentication flow
2. Test vehicle browsing and filtering
3. Implement remaining features (booking, chat, etc.)
4. Add more pages as needed
5. Customize styling with Tailwind CSS

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)


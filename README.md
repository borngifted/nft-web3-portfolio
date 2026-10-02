# Digital Noir - NFT Web3 Portfolio

A premium NFT/Web3 portfolio site featuring an interactive artboard system with draggable/zoomable canvas, wallet integration, and Digital Noir aesthetic.

## Design Philosophy: Digital Noir - Cinematic Brutalism

This project embodies a unique fusion of Neo-Brutalism and Film Noir aesthetics:

- **Monochrome Foundation**: Pure black (#000000) and white (#FFFFFF) with cyan accent (#00E5FF)
- **Textural Atmosphere**: Persistent film grain overlay and scanline effects
- **Geometric Precision**: Brutalist layout with no rounded corners
- **Cinematic Motion**: Smooth, intentional animations with bezier easing
- **Typography**: Playfair Display (titles), Inter (body), JetBrains Mono (metadata)

## Features

### ✨ Interactive Artboard
- **Drag to pan**: Click and drag to navigate the artwork grid
- **Scroll to zoom**: Mouse wheel zooms in/out with smooth scaling (0.5x - 2x)
- **Momentum physics**: Inertial scrolling with natural deceleration
- **Light leak effects**: Cyan glow on hover with subtle parallax
- **Scanline animations**: Horizontal sweep effects on interaction

### 🎨 Artwork Display
- **323 unique artworks** from optimized manifest
- **Responsive images**: WebP/AVIF formats with multiple sizes
- **Lazy loading**: Efficient loading for performance
- **Detail view**: Full-screen overlay with metadata and actions

### 🔗 Web3 Integration
- **Wallet connection**: RainbowKit integration with custom styling
- **Multi-chain support**: Ethereum mainnet + Sepolia testnet
- **Contract placeholders**: Ready for ERC-721/ERC-1155 integration
- **View on chain**: Links to block explorer (pending contract)
- **Collect/Mint**: Stub for minting functionality

### 📄 Additional Pages
- **Drops**: Curated collections (current, upcoming, archived)
- **About**: Manifesto, technical details, and terms
- **Terms**: Licensing and usage clarity

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 with custom Digital Noir theme
- **Web3**: wagmi + viem + RainbowKit
- **Routing**: Wouter (lightweight client-side routing)
- **Build**: Vite 7

## Project Structure

```
nft-web3-portfolio/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Artboard.tsx          # Interactive canvas with drag/zoom
│   │   │   ├── ArtworkCard.tsx       # Individual artwork cards
│   │   │   ├── ArtworkDetail.tsx     # Full-screen detail view
│   │   │   ├── WalletConnect.tsx     # Custom wallet button
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Main artboard page
│   │   │   ├── Drops.tsx             # Drops listing
│   │   │   └── About.tsx             # About & terms
│   │   ├── types/
│   │   │   └── artwork.ts            # TypeScript interfaces
│   │   ├── lib/
│   │   │   └── web3.ts               # Web3 configuration
│   │   ├── App.tsx                   # Root component with providers
│   │   └── index.css                 # Digital Noir theme
│   └── public/
│       ├── assets/manifest.json      # Artwork metadata
│       └── media/                    # Artwork images, videos, audio
└── server/
    └── index.ts                      # Local dev server
```

## Setup Instructions

### Prerequisites
- Node.js 22+
- pnpm 10+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nft-web3-portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Web3** (optional)
   - Get a WalletConnect Project ID from https://cloud.walletconnect.com/
   - Update `client/src/lib/web3.ts`:
     ```typescript
     projectId: 'YOUR_WALLETCONNECT_PROJECT_ID'
     ```

4. **Add contract details** (when ready)
   - Update contract addresses in `client/src/lib/web3.ts`
   - Implement mint/collect logic in `client/src/pages/Home.tsx`

5. **Start development server**
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000

### Build for Production

```bash
pnpm build
pnpm start
```

## Adding New Artworks

### Method 1: Add Optimized Files

1. **Export each artwork** as WebP and AVIF at the responsive widths (320, 640, 960, 1280, 1536) plus a thumbnail

2. **Copy the files** into `client/public/media/`

3. **Add an entry** to `client/public/assets/manifest.json` pointing at the new `/media/...` paths

### Method 2: Manual Manifest Update

Edit `client/public/assets/manifest.json` directly:

```json
{
  "artworks": [
    {
      "id": "nft-XXX",
      "title": "NFT #XXX",
      "number": XXX,
      "original_filename": "NFT_XXXup-low_res-scale-6_00x.jpg",
      "thumbnail": "/media/nft_XXX_thumb.webp",
      "srcset": {
        "webp": { ... },
        "avif": { ... }
      },
      "dimensions": { "width": 1536, "height": 1536 },
      "year": 2026,
      "edition": "Limited",
      "tags": ["digital", "generative", "abstract"],
      "status": "available"
    }
  ]
}
```

## Web3 Integration Guide

### Contract Setup

1. **Deploy your NFT contract** (ERC-721 or ERC-1155)

2. **Update contract config** in `client/src/lib/web3.ts`:
   ```typescript
   export const CONTRACT_CONFIG = {
     mainnet: {
       address: '0xYourContractAddress',
       chainId: 1,
       standard: 'ERC-721',
     },
   };
   ```

3. **Implement mint function** in `client/src/pages/Home.tsx`:
   ```typescript
   const handleCollect = async () => {
     if (!isConnected) {
       toast.error('Please connect your wallet first');
       return;
     }
     
     try {
       // Use wagmi's writeContract or custom contract interaction
       // Example: await writeContract({ ... })
       toast.success('Minting in progress...');
     } catch (error) {
       toast.error('Minting failed');
     }
   };
   ```

4. **Add block explorer links**:
   ```typescript
   const handleViewOnChain = () => {
     const contractAddress = CONTRACT_CONFIG.mainnet.address;
     window.open(`https://etherscan.io/address/${contractAddress}`, '_blank');
   };
   ```

## Performance Optimizations

### Implemented
- ✅ WebP/AVIF image formats with responsive sizes
- ✅ Lazy loading for all artwork images
- ✅ Thumbnail preview before full-size load
- ✅ CSS-based film grain (no heavy video)
- ✅ Transform-based animations (GPU accelerated)
- ✅ Debounced scroll/zoom handlers
- ✅ Momentum physics with requestAnimationFrame

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## Design Customization

### Color Palette
Edit `client/src/index.css`:
```css
:root {
  --background: oklch(0 0 0);        /* Pure black */
  --foreground: oklch(1 0 0);        /* Pure white */
  --primary: oklch(0.8 0.15 195);    /* Cyan accent */
}
```

### Typography
Update fonts in `client/index.html` and `client/src/index.css`:
```css
:root {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Film Grain Intensity
Adjust opacity in `client/src/index.css`:
```css
body::before {
  opacity: 0.04; /* Increase for more grain */
}
```

## Deployment

The site is hosted on GitHub Pages at https://borngiftedauthentic.com. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the client and publishes `dist/public`.

To build locally:
```bash
pnpm build
# Static site is in dist/public
```

See `DEPLOYMENT.md` for DNS and hosting details.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## License

See `client/src/pages/About.tsx` for licensing terms.

## Credits

- **Design Philosophy**: Digital Noir - Cinematic Brutalism
- **Image Optimization**: Python + Pillow
- **Web3 Stack**: wagmi + RainbowKit
- **UI Components**: shadcn/ui + Tailwind CSS

---

**Note**: This is a template/MVP. Contract addresses and mint functionality need to be implemented based on your specific NFT contract deployment.

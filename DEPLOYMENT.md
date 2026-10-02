# Deployment Guide - Digital Noir NFT Portfolio

## Pre-Deployment Checklist

### 1. Asset Management

All artwork images, scroll videos, and audio live in `client/public/media/` (about 465MB) and are served from the same domain as the site. `client/public/assets/manifest.json` and the configs in `client/src/config/` reference them as `/media/<file>`.

GitHub rejects files over 100MB and Pages sites are limited to 1GB, so keep new media within those limits.

### 2. Web3 Configuration

Update `client/src/lib/web3.ts` with your actual values:

```typescript
export const config = getDefaultConfig({
  appName: 'Digital Noir Collection',
  projectId: 'YOUR_ACTUAL_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com/
  chains: [mainnet, sepolia],
  ssr: false,
});

export const CONTRACT_CONFIG = {
  mainnet: {
    address: '0xYourActualContractAddress',
    chainId: 1,
    standard: 'ERC-721',
  },
};
```

### 3. Environment Variables

The static site needs no environment variables.

The optional Express server (`pnpm dev` / `pnpm start`) exposes `POST /api/contact`, which forwards to Telegram. It is not part of the GitHub Pages deploy. To use it, set:

```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Deployment Steps

### Option 1: GitHub Pages (Current)

The site is served from GitHub Pages at https://borngiftedauthentic.com.

1. **Push to `main`**
   - `.github/workflows/deploy.yml` installs dependencies, runs `vite build`, and publishes `dist/public`
   - The workflow copies `index.html` to `404.html` so client-side routes like `/noir` load on refresh

2. **Custom domain**
   - `client/public/CNAME` contains `borngiftedauthentic.com`
   - DNS at the registrar:
     - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     - `CNAME` for `www`: `borngifted.github.io`
   - "Enforce HTTPS" is enabled in the repository's Pages settings once the certificate is issued

### Option 2: Vercel

1. **Prepare repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

3. **Configure build settings** (if needed)
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

### Option 3: Netlify

1. **Build locally**
   ```bash
   pnpm build
   ```

2. **Deploy**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

### Option 4: Traditional Hosting

1. **Build**
   ```bash
   pnpm build
   ```

2. **Upload `dist/` directory** to your hosting provider

3. **Configure server**
   - Ensure all routes serve `index.html` (for client-side routing)
   - Enable gzip/brotli compression
   - Set cache headers for static assets

## Post-Deployment

### 1. Test Core Functionality

- [ ] Artboard loads with all artworks
- [ ] Drag to pan works smoothly
- [ ] Scroll to zoom functions correctly
- [ ] Artwork detail view opens and closes
- [ ] Navigation between pages works
- [ ] Wallet connection works (if configured)

### 2. Performance Check

Run Lighthouse audit:
- Performance: Target 90+
- Accessibility: Target 95+
- Best Practices: Target 95+
- SEO: Target 90+

### 3. Browser Testing

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

### 4. Web3 Integration

If you've configured contracts:
- [ ] Test wallet connection on mainnet
- [ ] Test wallet connection on testnet
- [ ] Verify "View on chain" links work
- [ ] Test collect/mint functionality (on testnet first!)

## Troubleshooting

### Images not loading

**Problem**: 404 errors for image assets

**Solution**: 
- Verify manifest.json paths are correct
- Check that the files exist in `client/public/media/`

### Wallet connection fails

**Problem**: WalletConnect errors

**Solution**:
- Verify WalletConnect Project ID is correct
- Check that project is active on WalletConnect dashboard
- Ensure correct chain IDs are configured

### Build fails

**Problem**: Build errors or timeouts

**Solution**:
- Check that all dependencies are installed
- Verify TypeScript has no errors: `pnpm check`

### Routing doesn't work

**Problem**: 404 on page refresh

**Solution**:
- Configure server to serve `index.html` for all routes
- For Netlify: Add `_redirects` file
- For Vercel: Add `vercel.json` with rewrites

## Monitoring

### Analytics

No analytics are included. To add analytics:

1. **Google Analytics**
   ```html
   <!-- Add to client/index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Plausible/Fathom**
   ```html
   <!-- Add to client/index.html -->
   <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
   ```

### Error Tracking

Consider adding Sentry or similar:

```bash
pnpm add @sentry/react
```

```typescript
// In client/src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

## Maintenance

### Updating Artworks

1. Export the new images as WebP/AVIF at the responsive widths
2. Add them to `client/public/media/`
3. Update `client/public/assets/manifest.json`
4. Push to `main`

### Updating Contract

1. Update `client/src/lib/web3.ts` with new contract address
2. Update mint logic in `client/src/pages/Home.tsx`
3. Test on testnet
4. Deploy to production

### Updating Design

1. Modify `client/src/index.css` for theme changes
2. Update components as needed
3. Test thoroughly
4. Deploy

## Security Considerations

- [ ] Never commit private keys or sensitive data
- [ ] Use environment variables for API keys
- [ ] Validate all user inputs
- [ ] Test contract interactions on testnet first
- [ ] Implement rate limiting if adding backend
- [ ] Keep dependencies updated
- [ ] Monitor for security advisories

## Support

For issues with:
- **GitHub Pages**: https://docs.github.com/pages
- **Web3 integration**: Check wagmi/RainbowKit docs
- **General React/Vite**: Check official documentation

---

**Last Updated**: 2026-02-07
**Version**: 1.0.0

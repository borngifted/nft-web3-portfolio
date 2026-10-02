/**
 * DESIGN PHILOSOPHY: Digital Noir - Cinematic Brutalism
 * About page with manifesto and terms
 */

import { Link } from 'wouter';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-display text-2xl hover:text-primary transition-colors">
                DIGITAL NOIR
              </Link>
            </div>
            <nav className="flex gap-6">
              <Link href="/" className="text-mono text-xs hover:text-primary transition-colors">
                ARTBOARD
              </Link>
              <Link href="/drops" className="text-mono text-xs hover:text-primary transition-colors">
                DROPS
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-16">
        {/* Manifesto */}
        <section className="max-w-3xl mb-24">
          <h1 className="text-display text-6xl mb-8">ABOUT</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <p>
              Digital Noir is an exploration of contrast, texture, and restraint in the digital medium.
              Born from the intersection of brutalist design principles and film noir aesthetics, this
              collection challenges the notion that digital art must be colorful to be compelling.
            </p>

            <p>
              Each piece in this collection is a study in monochrome—pure black and white with no
              intermediate grays, only the illusion of depth created through pattern, noise, and
              composition. The persistent film grain overlay serves as a reminder of analog origins,
              a textural bridge between physical and digital worlds.
            </p>

            <p>
              The cyan accent—our singular departure from monochrome—represents digital energy,
              the "light leak" of interaction, the glow of screens in darkened rooms. It appears
              only in moments of engagement, a reward for attention.
            </p>

            <p className="text-foreground">
              This is not maximalism. This is not decoration. This is intention.
            </p>
          </div>
        </section>

        {/* Technical details */}
        <section className="max-w-3xl mb-24">
          <h2 className="text-display text-3xl mb-8">TECHNICAL</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-mono text-xs text-muted-foreground mb-2">BLOCKCHAIN</h3>
              <p className="text-sm">Ethereum Mainnet (ERC-721)</p>
            </div>

            <div>
              <h3 className="text-mono text-xs text-muted-foreground mb-2">COLLECTION SIZE</h3>
              <p className="text-sm">323 unique artworks</p>
            </div>

            <div>
              <h3 className="text-mono text-xs text-muted-foreground mb-2">FORMAT</h3>
              <p className="text-sm">High-resolution digital images (1536×1536px)</p>
              <p className="text-sm text-muted-foreground mt-1">
                Optimized for web delivery with WebP/AVIF formats
              </p>
            </div>

            <div>
              <h3 className="text-mono text-xs text-muted-foreground mb-2">GENERATION</h3>
              <p className="text-sm">Algorithmically generated with manual curation</p>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="max-w-3xl">
          <h2 className="text-display text-3xl mb-8">TERMS</h2>
          
          <div className="space-y-6 text-sm text-muted-foreground">
            <div>
              <h3 className="text-foreground mb-2">Ownership</h3>
              <p>
                Purchasing an NFT from this collection grants you ownership of the unique digital
                artwork as recorded on the Ethereum blockchain. The artwork itself is stored on
                decentralized infrastructure.
              </p>
            </div>

            <div>
              <h3 className="text-foreground mb-2">License & Usage</h3>
              <p className="mb-2">
                Owners are granted a non-exclusive, worldwide license to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Display the artwork for personal, non-commercial purposes</li>
                <li>Include the artwork in personal galleries or portfolios</li>
                <li>Resell or transfer the NFT along with these usage rights</li>
              </ul>
            </div>

            <div>
              <h3 className="text-foreground mb-2">Restrictions</h3>
              <p className="mb-2">
                Without explicit written permission, owners may not:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the artwork for commercial purposes or merchandise</li>
                <li>Modify, alter, or create derivative works</li>
                <li>Use the artwork in ways that are defamatory or illegal</li>
                <li>Claim authorship or misrepresent the origin</li>
              </ul>
            </div>

            <div>
              <h3 className="text-foreground mb-2">Copyright</h3>
              <p>
                The creator retains all copyright and intellectual property rights to the artworks.
                Ownership of the NFT does not constitute a transfer of copyright.
              </p>
            </div>

            <div>
              <h3 className="text-foreground mb-2">No Warranty</h3>
              <p>
                The artworks are provided "as is" without warranty of any kind. The creator is not
                responsible for any technical issues, blockchain failures, or loss of access to
                the artwork.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-3xl mt-24 pt-24 border-t border-border">
          <p className="text-mono text-xs text-muted-foreground mb-2">INQUIRIES</p>
          <p className="text-sm">
            For licensing, collaborations, or other inquiries, please reach out via the
            connected wallet address or through established NFT marketplaces.
          </p>
        </section>
      </main>
    </div>
  );
}

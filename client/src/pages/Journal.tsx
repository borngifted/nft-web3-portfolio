/**
 * JOURNAL PAGE
 * Editorial essays exploring AI perception, memory, systems
 * Research note / field log aesthetic
 */

import { Link } from 'wouter';

// Placeholder journal entries
const entries = [
  {
    id: 1,
    title: 'AI Perception and the Cinematic Gaze',
    date: '2026.02.01',
    excerpt: 'On training models to see like cinematographers—not through technical precision, but through atmospheric intent.',
    tags: ['AI', 'Cinema', 'Perception'],
  },
  {
    id: 2,
    title: 'Memory as System Architecture',
    date: '2026.01.15',
    excerpt: 'How memory structures narrative. How narrative structures systems. How systems generate memory.',
    tags: ['Systems', 'Memory', 'Narrative'],
  },
  {
    id: 3,
    title: 'Sound as Spatial Architecture',
    date: '2025.12.20',
    excerpt: 'Exploring frequency as dimension—where sound becomes space, and space becomes navigable.',
    tags: ['Music', 'Systems', 'Sound Design'],
  },
  {
    id: 4,
    title: 'Digital Artifacts and Imperfection',
    date: '2025.11.30',
    excerpt: 'Why procedural systems need noise, grain, and error to feel human.',
    tags: ['AI', 'Aesthetics', 'Process'],
  },
  {
    id: 5,
    title: 'Cinematic Autonomy',
    date: '2025.10.18',
    excerpt: 'When systems generate narrative without human intervention—and why authorship still matters.',
    tags: ['Film', 'AI', 'Authorship'],
  },
];

export default function Journal() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-foreground/10">
        <div className="flex items-center justify-between p-6">
          <Link href="/">
            <button className="text-[10px] tracking-wider text-foreground/60 hover:text-foreground transition-colors">
              ← RETURN TO ARCHIVE
            </button>
          </Link>
          <p className="text-[10px] tracking-wider text-foreground/60">JOURNAL</p>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-8 space-y-16">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-tight">
              Research Notes
            </h1>
            <p className="text-sm text-foreground/60 tracking-wide">
              Essays exploring AI perception, memory, systems, and cinematic autonomy
            </p>
          </div>

          {/* Entries */}
          <div className="space-y-8">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="border-l-2 border-foreground/10 pl-6 py-4 hover:border-primary transition-colors cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-2xl font-light tracking-tight group-hover:text-primary transition-colors">
                      {entry.title}
                    </h2>
                    <time className="text-xs text-foreground/60 tracking-wider">
                      {entry.date}
                    </time>
                  </div>
                  <p className="text-base leading-relaxed text-foreground/80">
                    {entry.excerpt}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs tracking-wider text-foreground/60 border border-foreground/10 px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Coming soon note */}
          <div className="pt-12 border-t border-foreground/10">
            <p className="text-sm text-foreground/60 tracking-wide">
              New entries published periodically. Each essay explores the intersection of systems thinking, 
              cinematic narrative, and procedural intelligence.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

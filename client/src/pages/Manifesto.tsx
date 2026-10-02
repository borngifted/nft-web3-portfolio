/**
 * MANIFESTO PAGE
 * Editorial, minimal, precise, philosophical
 * Exhibition wall text, not pitch deck
 */

import { Link } from 'wouter';

export default function Manifesto() {
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
          <p className="text-[10px] tracking-wider text-foreground/60">MANIFESTO</p>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-8 space-y-16">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-tight">
              Systems in Motion
            </h1>
            <p className="text-sm text-foreground/60 tracking-wide">
              A statement of authorship
            </p>
          </div>

          {/* Body */}
          <div className="space-y-8 text-base leading-relaxed">
            <p>
              This work exists at the intersection of film, music, artificial intelligence, and systems design. 
              It is not bound by medium, but by method—a commitment to exploring hyper-realistic surrealism 
              through cinematic narrative and procedural intelligence.
            </p>

            <p>
              Each project is a system. Each system is a world. Each world is a lens through which to observe 
              the collision of memory, perception, and emergence.
            </p>

            <p className="text-foreground/80 italic border-l-2 border-primary pl-6">
              "Code is not a tool. It is a cinematic instrument."
            </p>

            <p>
              The films are not scripted. They are generated. The music is not composed. It is architected. 
              The images are not captured. They are synthesized. Yet all of it feels human—because the systems 
              themselves are designed to reflect the imperfections, rhythms, and intuitions of lived experience.
            </p>

            <p>
              This is not automation. This is authorship through systems.
            </p>

            <div className="pt-8 space-y-4">
              <h2 className="text-2xl font-light tracking-tight">The Archive as Medium</h2>
              <p>
                This portfolio is not a showcase. It is an archive—a living, explorable environment where 
                projects, experiments, and research coexist. It accumulates over time. It resists hierarchy. 
                It invites exploration without demanding linearity.
              </p>
              <p>
                The artboard is the interface. The artifacts are the evidence. The experience is the argument.
              </p>
            </div>

            <div className="pt-8 space-y-4">
              <h2 className="text-2xl font-light tracking-tight">AI as Lens, Not Author</h2>
              <p>
                Artificial intelligence is not the creator. It is the lens. It amplifies intention. 
                It reveals patterns. It generates possibilities. But it does not decide. That is the role 
                of the designer, the filmmaker, the systems architect.
              </p>
              <p>
                The work here is not "AI art." It is art made possible by AI—systems designed to extend 
                perception, not replace it.
              </p>
            </div>

            <div className="pt-8 space-y-4">
              <h2 className="text-2xl font-light tracking-tight">Process as Signature</h2>
              <p>
                Every project documented here carries a signature—not in style, but in process. 
                The signature is the system. The system is the method. The method is the message.
              </p>
              <p>
                This is work that could not exist without code. Without pipelines. Without procedural thinking. 
                But it is not technical work. It is cinematic work, made technical.
              </p>
            </div>

            <div className="pt-12 pb-8 border-t border-foreground/10">
              <p className="text-sm text-foreground/60 tracking-wide">
                Tyqawn Headen (BornGifted) — Creative Technologist, Filmmaker, Systems Designer
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

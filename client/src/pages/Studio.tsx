/**
 * STUDIO PAGE
 * Narrative vision - statement of authorship
 * Not "About Me" - explains creative philosophy
 */

import { Link } from 'wouter';

export default function Studio() {
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
          <p className="text-[10px] tracking-wider text-foreground/60">STUDIO</p>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-8 space-y-16">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-tight">
              Narrative Vision
            </h1>
            <p className="text-sm text-foreground/60 tracking-wide">
              Creative philosophy and approach
            </p>
          </div>

          {/* Philosophy sections */}
          <div className="space-y-12">
            {/* Code as Cinematic Instrument */}
            <section className="space-y-4">
              <h2 className="text-2xl font-light tracking-tight border-l-2 border-primary pl-4">
                Code as Cinematic Instrument
              </h2>
              <div className="pl-6 space-y-3 text-base leading-relaxed">
                <p>
                  Code is not infrastructure. It is not scaffolding. It is the instrument itself—capable of 
                  generating rhythm, texture, motion, and narrative. When wielded with cinematic intent, 
                  code becomes a medium for storytelling.
                </p>
                <p className="text-foreground/80">
                  The studio operates at this intersection: where procedural logic meets emotional resonance, 
                  where algorithms produce atmosphere, where systems generate worlds that feel lived-in.
                </p>
              </div>
            </section>

            {/* Systems as Medium */}
            <section className="space-y-4">
              <h2 className="text-2xl font-light tracking-tight border-l-2 border-primary pl-4">
                Systems as Medium
              </h2>
              <div className="pl-6 space-y-3 text-base leading-relaxed">
                <p>
                  Every project is a system. A film is a system of frames, sound, and time. A music album is 
                  a system of frequencies, rhythms, and silence. An AI pipeline is a system of inputs, 
                  transformations, and emergent outputs.
                </p>
                <p className="text-foreground/80">
                  The medium is not the output—it is the system that produces it. The authorship lies in 
                  designing the conditions for emergence, not dictating the result.
                </p>
              </div>
            </section>

            {/* AI as Lens, Not Author */}
            <section className="space-y-4">
              <h2 className="text-2xl font-light tracking-tight border-l-2 border-primary pl-4">
                AI as Lens, Not Author
              </h2>
              <div className="pl-6 space-y-3 text-base leading-relaxed">
                <p>
                  Artificial intelligence is a tool of perception. It does not create—it reveals. It amplifies 
                  patterns. It generates possibilities. But it does not decide. The designer decides.
                </p>
                <p className="text-foreground/80">
                  This work uses AI not as a replacement for authorship, but as an extension of it—a lens 
                  through which to explore hyper-realistic surrealism, procedural narrative, and emergent aesthetics.
                </p>
              </div>
            </section>

            {/* Process as Signature */}
            <section className="space-y-4">
              <h2 className="text-2xl font-light tracking-tight border-l-2 border-primary pl-4">
                Process as Signature
              </h2>
              <div className="pl-6 space-y-3 text-base leading-relaxed">
                <p>
                  The signature is not in style—it is in process. The process is the method. The method is 
                  the message. Every project carries the trace of its system, its pipeline, its logic.
                </p>
                <p className="text-foreground/80">
                  This is work that could not exist without code, without procedural thinking, without systems 
                  design. But it is not technical work. It is cinematic work, made technical.
                </p>
              </div>
            </section>
          </div>

          {/* Approach */}
          <div className="pt-12 space-y-6 border-t border-foreground/10">
            <h2 className="text-3xl font-light tracking-tight">Approach</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-sm font-medium tracking-wide text-foreground/60">TOOLS</h3>
                <ul className="space-y-1 text-sm">
                  <li>Unreal Engine</li>
                  <li>AI Pipelines (Stable Diffusion, ComfyUI)</li>
                  <li>Custom Workflows</li>
                  <li>Procedural Systems</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium tracking-wide text-foreground/60">MEDIUM</h3>
                <ul className="space-y-1 text-sm">
                  <li>Film + Narrative</li>
                  <li>Music + Sound Design</li>
                  <li>AI + Systems</li>
                  <li>Code + Cinema</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="pt-12 pb-8 border-t border-foreground/10">
            <p className="text-sm text-foreground/60 tracking-wide mb-4">
              For collaboration inquiries, system design, or creative direction:
            </p>
            <Link href="/contact">
              <button className="px-8 py-3 bg-foreground text-background text-xs tracking-wider hover:bg-foreground/90 transition-colors">
                CONTACT
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

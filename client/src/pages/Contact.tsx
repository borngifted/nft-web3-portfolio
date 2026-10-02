/**
 * CONTACT PAGE
 * Minimal, intentional
 * No calls to action, no urgency language
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    toast.success('Message sent. You will receive a response within 48 hours.');
    setFormData({ name: '', email: '', projectType: '', budget: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
          <p className="text-[10px] tracking-wider text-foreground/60">CONTACT</p>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-8 space-y-16">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-tight">
              Collaboration
            </h1>
            <p className="text-sm text-foreground/60 tracking-wide">
              DIGITAL / GLOBAL
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs tracking-wider text-foreground/60 uppercase">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-foreground/20 py-2 text-base focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs tracking-wider text-foreground/60 uppercase">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-foreground/20 py-2 text-base focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <label htmlFor="projectType" className="text-xs tracking-wider text-foreground/60 uppercase">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className="w-full bg-background border-b border-foreground/20 py-2 text-base focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                <option value="">Select type</option>
                <option value="film">Film</option>
                <option value="ai">AI</option>
                <option value="music">Music</option>
                <option value="systems">Systems</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Budget (Optional) */}
            <div className="space-y-2">
              <label htmlFor="budget" className="text-xs tracking-wider text-foreground/60 uppercase">
                Budget (Optional)
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., $10k–$50k"
                className="w-full bg-transparent border-b border-foreground/20 py-2 text-base focus:border-primary focus:outline-none transition-colors placeholder:text-foreground/30"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs tracking-wider text-foreground/60 uppercase">
                Intent
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe the project, system, or collaboration you have in mind..."
                className="w-full bg-transparent border border-foreground/20 p-4 text-base focus:border-primary focus:outline-none transition-colors placeholder:text-foreground/30 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-foreground text-background text-xs tracking-wider hover:bg-foreground/90 transition-colors"
              >
                SEND MESSAGE
              </button>
            </div>
          </form>

          {/* Additional info */}
          <div className="pt-12 border-t border-foreground/10 space-y-4">
            <p className="text-sm text-foreground/60 leading-relaxed">
              Response time: 24–48 hours
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed">
              For urgent inquiries or technical collaboration, include relevant links, references, 
              or system documentation in your message.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

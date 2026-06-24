"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { AlbumPhoto } from "@/lib/site-config";

interface Props {
  photos: AlbumPhoto[];
}

export function PhotoAlbum({ photos }: Props) {
  const [lightbox, setLightbox] = useState<AlbumPhoto | null>(null);

  if (!photos.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">Our Work</p>
          <h2 className="text-4xl lg:text-5xl font-black text-charcoal mb-4">Project Photos</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">A closer look at the quality and craftsmanship behind every job.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 7) * 0.06, duration: 0.4 }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-card hover:shadow-card-hover transition-shadow"
              onClick={() => setLightbox(photo)}
            >
              <Image
                src={photo.src}
                alt={photo.caption ?? "MAK Painting project photo"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-bold truncate">{photo.caption}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-3xl w-full max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[80vh] rounded-2xl overflow-hidden bg-black">
                <Image
                  src={lightbox.src}
                  alt={lightbox.caption ?? "Project photo"}
                  width={1200}
                  height={900}
                  className="object-contain w-full max-h-[80vh]"
                  unoptimized={lightbox.src.startsWith("http")}
                />
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                {lightbox.caption
                  ? <p className="text-white font-bold">{lightbox.caption}</p>
                  : <span />
                }
                <button onClick={() => setLightbox(null)} className="text-white/60 hover:text-white p-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

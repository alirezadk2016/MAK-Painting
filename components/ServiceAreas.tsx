import { SUBURBS } from "@/data/site";

export function ServiceAreas() {
  return (
    <section id="areas" className="py-16 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">Where we work</p>
          <h2 className="text-3xl lg:text-4xl font-black text-charcoal mb-3">Service areas</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            We paint homes and businesses across Greater Melbourne. Not listed? Give us a call — we probably cover your area.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {SUBURBS.map((suburb) => (
            <span
              key={suburb}
              className="bg-white text-charcoal text-sm font-semibold rounded-full px-4 py-2 border border-gray-200 shadow-sm hover:border-blue-brand hover:text-blue-brand transition-colors cursor-default"
            >
              {suburb}
            </span>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-6 flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a5 5 0 0 1 5 5c0 4-5 9-5 9S3 10 3 6a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          All Melbourne suburbs and surrounding areas serviced
        </p>
      </div>
    </section>
  );
}

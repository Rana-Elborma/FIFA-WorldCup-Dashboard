import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselImage {
  src: string;
  alt: string;
}

export interface FeatureCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: string;
  images: CarouselImage[];
  /** Render overlay content per slide */
  renderContent?: (index: number) => React.ReactNode;
  autoPlayMs?: number;
}

export const FeatureCarousel = React.forwardRef<HTMLDivElement, FeatureCarouselProps>(
  ({ title, subtitle, images, renderContent, autoPlayMs = 4500, className = "", ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(Math.floor(images.length / 2));

    const handleNext = React.useCallback(() => {
      setCurrentIndex((p) => (p + 1) % images.length);
    }, [images.length]);

    const handlePrev = React.useCallback(() => {
      setCurrentIndex((p) => (p - 1 + images.length) % images.length);
    }, [images.length]);

    React.useEffect(() => {
      const t = setInterval(handleNext, autoPlayMs);
      return () => clearInterval(t);
    }, [handleNext, autoPlayMs]);

    return (
      <div
        ref={ref}
        className={`relative w-full flex flex-col items-center justify-center overflow-x-hidden ${className}`}
        {...props}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="z-10 text-center space-y-3 mb-8 px-4">
            {title && <h3 className="text-3xl font-black text-white">{title}</h3>}
            {subtitle && <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">{subtitle}</p>}
          </div>
        )}

        {/* Carousel */}
        <div className="relative w-full h-[420px] md:h-[480px] flex items-center justify-center">
          {/* 3D perspective wrapper */}
          <div className="relative w-full h-full flex items-center justify-center [perspective:1000px]">
            {images.map((image, index) => {
              const offset = index - currentIndex;
              const total = images.length;
              let pos = (offset + total) % total;
              if (pos > Math.floor(total / 2)) pos = pos - total;

              const isCenter = pos === 0;
              const isAdjacent = Math.abs(pos) === 1;
              const hidden = Math.abs(pos) > 1;

              return (
                <div
                  key={index}
                  className="absolute transition-all duration-500 ease-in-out flex flex-col items-center"
                  style={{
                    width: isCenter ? 260 : 200,
                    transform: `
                      translateX(${pos * 44}%)
                      scale(${isCenter ? 1 : isAdjacent ? 0.82 : 0.65})
                      rotateY(${pos * -12}deg)
                    `,
                    zIndex:   isCenter ? 10 : isAdjacent ? 5 : 1,
                    opacity:  isCenter ? 1  : isAdjacent ? 0.35 : 0,
                    filter:   isCenter ? "blur(0px)" : "blur(3px)",
                    visibility: hidden ? "hidden" : "visible",
                    cursor: isCenter ? "default" : "pointer",
                  }}
                  onClick={() => !isCenter && setCurrentIndex(index)}
                >
                  {/* Card */}
                  <div
                    className="relative rounded-3xl overflow-hidden border border-gray-800/80 shadow-2xl"
                    style={{
                      width: "100%",
                      height: isCenter ? 380 : 320,
                      boxShadow: isCenter ? "0 24px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.3)" : undefined,
                    }}
                  >
                    {/* Solid dark bg instead of image — clear text */}
                    <div className="absolute inset-0 bg-[#0d1126]" />
                    {/* Subtle accent glow at top */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl bg-purple-900/20 pointer-events-none" />
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-600/50 to-transparent" />
                    {/* Slot for custom content */}
                    {isCenter && renderContent && (
                      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
                        {renderContent(index)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#111827]/90 border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-gray-600 transition-colors backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#111827]/90 border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-gray-600 transition-colors backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-5 h-2 bg-purple-500" : "w-2 h-2 bg-gray-700 hover:bg-gray-500"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
);

FeatureCarousel.displayName = "FeatureCarousel";
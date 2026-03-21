import { Suspense, lazy } from 'react';

// Dynamically import Spline and handle both default and named exports for v4 compatibility
const Spline = lazy(() =>
  import('@splinetool/react-spline').then((mod) => ({
    default: mod.default ?? (mod as Record<string, unknown>).Spline ?? mod,
  }))
);

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`w-full h-full flex flex-col items-center justify-center bg-[#111827] text-white ${className ?? ''}`}
        >
          <svg
            className="animate-spin h-6 w-6 text-purple-400 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
            />
          </svg>
          <span className="text-gray-500 text-xs">Loading 3D scene...</span>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

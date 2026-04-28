// Ladebalken/Spinner für Scraping-Vorgang

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = "Laden..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
      </div>
      <p className="text-gray-500 text-sm animate-pulse">{text}</p>
    </div>
  );
}

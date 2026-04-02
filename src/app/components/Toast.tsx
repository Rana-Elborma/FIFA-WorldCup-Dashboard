import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-8 right-8 bg-gray-900 border border-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out] z-50">
      <CheckCircle className="text-green-500" size={24} />
      <span className="font-medium">{message}</span>
    </div>
  );
}

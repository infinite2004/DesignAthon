import { AlertCircle } from 'lucide-react';

type PantrySummaryCardProps = {
  totalItems: number;
  expiringSoon: number;
};

export function PantrySummaryCard({ totalItems, expiringSoon }: PantrySummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-teal">{totalItems}</p>
          <p className="text-sm text-gray-600 mt-1">Total items</p>
        </div>
        {expiringSoon > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl border border-orange-200">
            <AlertCircle size={18} className="text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-orange-900">
                {expiringSoon} expiring soon
              </p>
              <p className="text-xs text-orange-700">Use them this week</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


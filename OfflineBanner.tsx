'use client';

import { useOfflineStatus } from '@/hooks/useOfflineStatus';

export function OfflineBanner() {
  const isOffline = useOfflineStatus();
  if (!isOffline) return null;
  return (
    <div className="offline-banner" role="status">
      📴 オフラインモード — フレーズの参照・音声再生は引き続きご利用いただけます
    </div>
  );
}

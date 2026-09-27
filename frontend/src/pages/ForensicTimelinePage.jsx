import React from 'react';
import ForensicTimeline from '../components/timeline/ForensicTimeline';

export default function ForensicTimelinePage({ events }) {
  return (
    <div className="space-y-6">
      <ForensicTimeline events={events} />
    </div>
  );
}

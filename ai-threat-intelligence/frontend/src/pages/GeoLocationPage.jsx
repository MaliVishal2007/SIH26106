import React from 'react';
import GlobalThreatMap from '../components/geolocation/GlobalThreatMap';
import IPLookupTool from '../components/geolocation/IPLookupTool';

export default function GeoLocationPage({ origins }) {
  return (
    <div className="space-y-6">
      <GlobalThreatMap origins={origins} />
      <IPLookupTool />
    </div>
  );
}

import React from 'react';
import InvestigationGraph from '../components/graph/InvestigationGraph';

export default function InvestigationGraphPage({ graphData }) {
  return (
    <div className="space-y-6">
      <InvestigationGraph initialGraphData={graphData} />
    </div>
  );
}

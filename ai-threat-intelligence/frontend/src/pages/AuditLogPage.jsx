import React from 'react';
import ChainOfCustody from '../components/audit/ChainOfCustody';

export default function AuditLogPage({ auditLogs, onExportReport }) {
  return (
    <div className="space-y-6">
      <ChainOfCustody auditLogs={auditLogs} onExportReport={onExportReport} />
    </div>
  );
}

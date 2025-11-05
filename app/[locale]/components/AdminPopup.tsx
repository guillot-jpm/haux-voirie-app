'use client';

import { Report } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface AdminPopupProps {
  report: Report;
  onActionComplete: (reportId: string, approvedReport?: Report) => void;
}

const AdminPopup = ({ report, onActionComplete }: AdminPopupProps) => {
  const t = useTranslations('AdminPopup');

  const handleModeration = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        if (status === 'APPROVED') {
          const approvedReport = await response.json();
          onActionComplete(report.id, approvedReport);
        } else {
          onActionComplete(report.id);
        }
      } else {
        console.error('Failed to update report status');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
      <h3 className="font-bold">{report.issueType}</h3>
      <p>Severity: {report.severity}</p>
      <p>Status: {report.status}</p>
      {report.description && <p>Description: {report.description}</p>}
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => handleModeration('REJECTED')}>
          {t('reject')}
        </Button>
        <Button size="sm" onClick={() => handleModeration('APPROVED')}>
          {t('approve')}
        </Button>
      </div>
    </div>
  );
};

export default AdminPopup;

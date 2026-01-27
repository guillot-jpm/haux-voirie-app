'use client';

import { Report } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface AdminPopupProps {
  report: Report;
  onActionComplete: (reportId: string, updatedReport?: Report) => void;
  onRequestReject: (reportId: string) => void; // <--- NEW PROP
}

const AdminPopup = ({ report, onActionComplete, onRequestReject }: AdminPopupProps) => {
  const t = useTranslations('AdminPopup');
  const tEnums = useTranslations('Enums');

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        onActionComplete(report.id, updatedReport);
      } else {
        console.error('Failed to update report status');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
      <h3 className="font-bold">{tEnums(report.issueType)}</h3>
      <p>Severity: {tEnums(report.severity)}</p>
      <p>Status: {report.status}</p>
      {report.description && <p>Description: {report.description}</p>}
      {report.photoUrl && (
        <img
          src={report.photoUrl}
          alt="Report photo"
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
      )}
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRequestReject(report.id)} // <--- Call parent instead of opening local dialog
        >
          {t('reject')}
        </Button>
        <Button size="sm" onClick={handleApprove}>
          {t('approve')}
        </Button>
      </div>
    </div>
  );
};

export default AdminPopup;

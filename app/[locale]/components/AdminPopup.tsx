'use client';

import { Report } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { RejectionDialog } from '@/components/RejectionDialog';

interface AdminPopupProps {
  report: Report;
  onActionComplete: (reportId: string, updatedReport?: Report) => void;
}

const AdminPopup = ({ report, onActionComplete }: AdminPopupProps) => {
  const t = useTranslations('AdminPopup');
  const tEnums = useTranslations('Enums');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleModeration = async (
    newStatus: 'APPROVED' | 'REJECTED',
    rejectionReason?: string
  ) => {
    try {
      const body: { status: string; rejectionReason?: string } = {
        status: newStatus,
      };
      if (rejectionReason) {
        body.rejectionReason = rejectionReason;
      }

      const response = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
          onClick={() => setIsRejectDialogOpen(true)}
        >
          {t('reject')}
        </Button>
        <Button size="sm" onClick={() => handleModeration('APPROVED')}>
          {t('approve')}
        </Button>
      </div>

      <RejectionDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onConfirm={(reason) => {
          handleModeration('REJECTED', reason);
          setIsRejectDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AdminPopup;

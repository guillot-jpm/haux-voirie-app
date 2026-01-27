'use client';

import { Report } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { REJECTION_REASONS } from '@/app/[locale]/lib/constants';

interface AdminPopupProps {
  report: Report;
  onActionComplete: (reportId: string, updatedReport?: Report) => void;
}

const AdminPopup = ({ report, onActionComplete }: AdminPopupProps) => {
  const t = useTranslations('AdminPopup');
  const tEnums = useTranslations('Enums');
  const tReject = useTranslations('RejectionDialog'); // Reuse existing translations
  
  // Local state to manage the view mode (Details vs Rejection Form)
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeration = async (
    newStatus: 'APPROVED' | 'REJECTED',
    rejectionReason?: string
  ) => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- VIEW 1: REJECTION FORM ---
  if (isRejecting) {
    return (
      <div className="min-w-[200px] space-y-3">
        <h4 className="font-semibold text-sm">{tReject('title')}</h4>
        <p className="text-xs text-muted-foreground">{tReject('description')}</p>
        
        {/* Use native select for stability inside Leaflet Popups */}
        <select 
          className="w-full p-2 text-sm border rounded bg-background"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="" disabled>{tReject('placeholder')}</option>
          {REJECTION_REASONS.map((r) => (
            <option key={r} value={r}>
              {tEnums(r)}
            </option>
          ))}
        </select>

        <div className="flex justify-between gap-2 mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsRejecting(false)}
            disabled={isSubmitting}
            className="h-8"
          >
            {tReject('cancelButton')}
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => handleModeration('REJECTED', reason)}
            disabled={!reason || isSubmitting}
            className="h-8"
          >
            {isSubmitting ? "..." : tReject('confirmButton')}
          </Button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: REPORT DETAILS (Default) ---
  return (
    <div className="space-y-2 min-w-[200px]">
      <h3 className="font-bold text-base">{tEnums(report.issueType)}</h3>
      
      <div className="text-sm space-y-1">
        <p><span className="font-semibold">Severity:</span> {tEnums(report.severity)}</p>
        <p><span className="font-semibold">Status:</span> {report.status}</p>
        {report.description && (
          <p className="border-l-2 pl-2 italic text-muted-foreground">{report.description}</p>
        )}
      </div>

      {report.photoUrl && (
        <div className="mt-2">
          <img
            src={report.photoUrl}
            alt="Report photo"
            className="rounded-md object-cover w-full max-h-[150px]"
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsRejecting(true)}
          className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {t('reject')}
        </Button>
        <Button 
          size="sm" 
          onClick={() => handleModeration('APPROVED')}
          disabled={isSubmitting}
          className="h-8 text-xs"
        >
          {isSubmitting ? "..." : t('approve')}
        </Button>
      </div>
    </div>
  );
};

export default AdminPopup;

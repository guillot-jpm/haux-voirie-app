'use client';

import { Report } from '@prisma/client';
import { useTranslations } from 'next-intl';

interface AdminPopupProps {
  report: Report;
}

const AdminPopup = ({ report }: AdminPopupProps) => {
  const tEnums = useTranslations('Enums');

  return (
    <div>
      <h3 className="font-bold">{tEnums(report.issueType)}</h3>
      <p>Severity: {tEnums(report.severity)}</p>
      <p>Status: {report.status}</p>
      {report.description && <p>Description: {report.description}</p>}
      {report.photoUrl && <img src={report.photoUrl} alt="Report photo" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
    </div>
  );
};

export default AdminPopup;

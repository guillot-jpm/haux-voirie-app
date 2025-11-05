'use client';

import { Report } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ISSUE_TYPES, SEVERITY_LEVELS } from '@/app/[locale]/lib/constants';

interface AdminPopupProps {
  report: Report;
  onActionComplete: (reportId: string, updatedReport?: Report) => void;
}

const AdminPopup = ({ report, onActionComplete }: AdminPopupProps) => {
  const t = useTranslations('AdminPopup');
  const tEnums = useTranslations('Enums');

  const [isEditing, setIsEditing] = useState(false);
  const [issueType, setIssueType] = useState(report.issueType);
  const [severity, setSeverity] = useState(report.severity);
  const [description, setDescription] = useState(report.description || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState(report.status);

  const handleSave = async () => {
    let photoUrl = report.photoUrl;
    if (photo) {
      const response = await fetch(`/api/upload?filename=${photo.name}`, {
        method: 'POST',
        body: photo,
      });
      const newBlob = await response.json();
      photoUrl = newBlob.url;
    }

    try {
      const response = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          issueType,
          severity,
          description,
          photoUrl,
        }),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        onActionComplete(report.id, updatedReport);
        setIsEditing(false);
      } else {
        console.error('Failed to update report');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleModeration = async (newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
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

  if (isEditing) {
    return (
      <div>
        <h3 className="font-bold">{t('editReport')}</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            {t('issueTypeLabel')}
          </label>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)} style={{ width: '100%' }}>
            {ISSUE_TYPES.map(type => (
              <option key={type} value={type}>{tEnums(type)}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            {t('severityLabel')}
          </label>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ width: '100%' }}>
            {SEVERITY_LEVELS.map(level => (
              <option key={level} value={level}>{tEnums(level)}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            Description
          </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            Photo
          </label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files && setPhoto(e.target.files[0])} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            {t('statusLabel')}
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%' }}>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
            {t('cancel')}
          </Button>
          <Button size="sm" onClick={handleSave}>
            {t('save')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-bold">{report.issueType}</h3>
      <p>Severity: {report.severity}</p>
      <p>Status: {report.status}</p>
      {report.description && <p>Description: {report.description}</p>}
      {report.photoUrl && <img src={report.photoUrl} alt="Report photo" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          {t('edit')}
        </Button>
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

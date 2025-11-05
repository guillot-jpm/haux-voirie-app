"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { ISSUE_TYPES, SEVERITY_LEVELS } from "@/app/[locale]/lib/constants";
import { DomEvent } from "leaflet";
import { Report } from "@prisma/client";

interface ReportFormProps {
  location: { lat: number; lng: number };
  onReportSubmitted: (newReport: Report) => void;
  onCancel: () => void;
  onError: (error: { title: string; description: string }) => void;
}

export default function ReportForm({
  location,
  onReportSubmitted,
  onCancel,
  onError,
}: ReportFormProps) {
  const t = useTranslations('ReportDialog');
  const tEnums = useTranslations('Enums');
  const [issueType, setIssueType] = useState('');
  const [severity, setSeverity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      DomEvent.disableClickPropagation(formRef.current);
      DomEvent.disableScrollPropagation(formRef.current);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!issueType || !severity) {
      onError({
        title: "Error",
        description: "Please select both issue type and severity",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueType,
          severity,
          latitude: location.lat,
          longitude: location.lng,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit report");
      }

      const newReport = await response.json();
      onReportSubmitted(newReport);
    } catch (error: any) {
      console.error(error);
      // Specific check for banned user error from the API
      if (error.message === "Your account has been banned.") {
        onError({
          title: t('bannedUserTitle'),
          description: t('bannedUserDescription'),
        });
      } else {
        onError({
          title: "Error",
          description: error.message || "An error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div ref={formRef} style={{ minWidth: '250px', padding: '10px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        {t('title')}
      </h3>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
        {t('location', {lat: location.lat.toFixed(5), lng: location.lng.toFixed(5)})}
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            {t('issueTypeLabel')}
          </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            required
          >
            <option value="">{t('issueTypePlaceholder')}</option>
            {ISSUE_TYPES.map(type => (
              <option key={type} value={type}>{tEnums(type)}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            {t('severityLabel')}
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            required
          >
            <option value="">{t('severityPlaceholder')}</option>
            {SEVERITY_LEVELS.map(level => (
              <option key={level} value={level}>{tEnums(level)}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: isSubmitting ? '#ccc' : '#000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {isSubmitting ? t('submittingButton') : t('submitButton')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: 'white',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {t('cancelButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import * as React from 'react';

interface NewReportEmailProps {
  adminDashboardUrl: string;
}

export const NewReportEmail: React.FC<Readonly<NewReportEmailProps>> = ({
  adminDashboardUrl,
}) => (
  <div>
    <h1>New Report Submitted</h1>
    <p>A new report has been submitted on Haux Voirie.</p>
    <p>
      Please visit the admin dashboard to review it.
    </p>
    <a href={adminDashboardUrl}>View Dashboard</a>
  </div>
);

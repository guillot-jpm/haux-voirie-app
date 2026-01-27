import * as React from 'react';

interface NewReportEmailProps {
  adminDashboardUrl: string;
}

export const NewReportEmail: React.FC<Readonly<NewReportEmailProps>> = ({
  adminDashboardUrl,
}) => (
  <div>
    <h1>Nouveau signalement reçu</h1>
    <p>Un nouveau signalement a été effectué sur Haux Alerte.</p>
    <p>
      Veuillez consulter le tableau de bord pour l'examiner.
    </p>
    <a href={adminDashboardUrl}>Voir le tableau de bord</a>
  </div>
);

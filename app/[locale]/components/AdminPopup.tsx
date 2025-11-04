"use client";

import { Report } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface AdminPopupProps {
  report: Report;
  onActionComplete: (reportId: string) => void;
}

const AdminPopup = ({ report, onActionComplete }: AdminPopupProps) => {
  const tEnums = useTranslations("Enums");
  const tAdmin = useTranslations("Admin");

  const handleModeration = async (status: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        onActionComplete(report.id);
      } else {
        // Handle error - maybe show a toast notification in the future
        console.error("Failed to update report status");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleApprove = () => handleModeration("APPROVED");
  const handleReject = () => handleModeration("REJECTED");

  return (
    <div>
      <p>
        <b>Issue Type:</b> {tEnums(report.issueType)}
      </p>
      <p>
        <b>Severity:</b> {tEnums(report.severity)}
      </p>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
        <Button onClick={handleApprove}>{tAdmin("approve")}</Button>
        <Button onClick={handleReject} variant="destructive">
          {tAdmin("reject")}
        </Button>
      </div>
    </div>
  );
};

export default AdminPopup;

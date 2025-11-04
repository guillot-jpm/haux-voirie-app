"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import dynamic from 'next/dynamic';

const MiniMap = dynamic(() => import('./MiniMap'), { ssr: false });

interface Report {
  id: string;
  issueType: string;
  severity: string;
  latitude: number;
  longitude: number;
  author: {
    id: string;
    email: string | null;
  };
  createdAt: string;
}

const AdminDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isBanConfirmOpen, setIsBanConfirmOpen] = useState(false);
  const t = useTranslations('AdminDashboard');
  const tEnums = useTranslations('Enums');


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/admin/reports");
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${status.toLowerCase()} report`);
      }

      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBanUser = async () => {
    if (!selectedReport) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedReport.author.id}/ban`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to ban user");
      }

      // Automatically reject the report after banning the user
      await handleUpdateStatus(selectedReport.id, "REJECTED");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBanConfirmOpen(false);
      setSelectedReport(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('issueType')}</TableHead>
                <TableHead>{t('severity')}</TableHead>
                <TableHead>{t('author')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('location')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{tEnums(report.issueType)}</TableCell>
                  <TableCell>{tEnums(report.severity)}</TableCell>
                  <TableCell>{report.author.email}</TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <MiniMap latitude={report.latitude} longitude={report.longitude} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleUpdateStatus(report.id, "APPROVED")}
                        className="w-full"
                      >
                        {t('approveButton')}
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(report.id, "REJECTED")}
                        variant="destructive"
                        className="w-full"
                      >
                        {t('rejectButton')}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedReport(report);
                          setIsBanConfirmOpen(true);
                        }}
                        variant="destructive"
                        className="w-full"
                      >
                        {t('banUserButton')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isBanConfirmOpen} onOpenChange={setIsBanConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('banConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('banConfirmDescription', {userEmail: selectedReport?.author.email || ''})}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedReport(null)}>
              {t('cancelButton')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleBanUser}>
              {t('confirmButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminDashboard;

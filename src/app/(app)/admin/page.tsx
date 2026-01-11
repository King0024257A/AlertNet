'use client';

import { Header } from '@/components/header';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { sendAnalyticsEmail } from '@/ai/flows/send-analytics-email';
import { format, subDays } from 'date-fns';

export default function AdminPage() {
  const { user, loading, alerts, deleteAlert, allUsers } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      redirect('/dashboard');
    }
  }, [user, loading]);

  const analyticsData = useMemo(() => {
    const alertsBySeverity = { Low: 0, Medium: 0, High: 0 };
    alerts.forEach(alert => {
        alertsBySeverity[alert.severity]++;
    });

    const alertsLast7Days: Record<string, number> = {};
    Array.from({ length: 7 }).forEach((_, i) => {
        const d = subDays(new Date(), i);
        alertsLast7Days[format(d, 'MMM dd')] = 0;
    });

    alerts.forEach(alert => {
        const alertDateStr = format(new Date(alert.timestamp), 'MMM dd');
        if (alertDateStr in alertsLast7Days) {
            alertsLast7Days[alertDateStr]++;
        }
    });
    
    const sortedAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const mostRecentAlert = sortedAlerts.length > 0 ? {
        title: sortedAlerts[0].title,
        location: sortedAlerts[0].location,
        timestamp: format(new Date(sortedAlerts[0].timestamp), 'PPpp')
    } : undefined;

    return {
        totalAlerts: alerts.length,
        alertsBySeverity,
        alertsLast7Days,
        mostRecentAlert,
    };
  }, [alerts]);

  if (loading || user?.role !== 'admin') {
    return null; // Or a loading/unauthorized component
  }
  
  const handleDelete = (id: string) => {
    deleteAlert(id);
    toast({
        title: 'Alert Deleted',
        description: `Alert with ID ${id} has been removed.`,
    });
  };

  const sendGlobalNotification = async () => {
    setIsSending(true);
    try {
        const recipientEmails = allUsers.map(u => u.email);
        const result = await sendAnalyticsEmail({
            recipientEmails,
            analytics: analyticsData,
        });

        if (result.success) {
            toast({
                title: 'Global Notification Sent!',
                description: `Email simulation complete for ${result.sentEmails} users. Check the console for details.`,
            });
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Failed to send notification:", error);
        toast({
            variant: "destructive",
            title: 'Failed to Send Notification',
            description: 'There was an error processing the global notification.',
        });
    } finally {
        setIsSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header title="Admin Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
            <CardHeader className='flex-row items-center justify-between'>
                <div>
                    <CardTitle className="font-headline text-2xl">Alert Management</CardTitle>
                    <CardDescription>View, manage, and delete all user-submitted alerts.</CardDescription>
                </div>
                <Button onClick={sendGlobalNotification} disabled={isSending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {isSending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSending ? 'Sending...' : 'Send Global Notification'}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Reported By</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {alerts.map(alert => (
                            <TableRow key={alert.id}>
                                <TableCell className="font-medium">{alert.title}</TableCell>
                                <TableCell>
                                    <Badge variant={alert.severity === 'High' ? 'destructive' : alert.severity === 'Medium' ? 'secondary' : 'default'}>{alert.severity}</Badge>
                                </TableCell>
                                <TableCell>{alert.location}</TableCell>
                                <TableCell>{alert.reportedBy}</TableCell>
                                <TableCell>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" disabled={user?.role !== 'admin'}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the alert.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(alert.id)} className='bg-destructive hover:bg-destructive/90'>
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

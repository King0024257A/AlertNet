'use client';

import { Header } from '@/components/header';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Alert } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Send } from 'lucide-react';
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

export default function AdminPage() {
  const { user, loading, alerts, deleteAlert } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      redirect('/dashboard');
    }
  }, [user, loading]);

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

  const sendGlobalNotification = () => {
    toast({
        title: 'Global Notification Sent',
        description: 'A notification has been broadcast to all users (simulation).',
    });
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
                <Button onClick={sendGlobalNotification} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Send className="mr-2 h-4 w-4" />
                    Send Global Notification
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
                                            <Button variant="ghost" size="icon">
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

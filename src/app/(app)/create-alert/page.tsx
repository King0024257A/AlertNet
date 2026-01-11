'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateAlertForm } from '@/components/create-alert-form';
import { useAuth } from '@/contexts/auth-context';

export default function CreateAlertPage() {
  const { user } = useAuth();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header title="Report an Alert" />
      <main className="flex-1 p-4 md:p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">New Disaster Report</CardTitle>
            <CardDescription>
              Fill out the form below to report a new incident. Your report will be verified and detailed by our AI system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateAlertForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

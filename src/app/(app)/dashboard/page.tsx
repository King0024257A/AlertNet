'use client';

import { AlertCard } from '@/components/alert-card';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const { alerts } = useAuth();
  const verifiedAlerts = alerts.filter(alert => alert.isVerified);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header title="Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight">
              Verified Alerts
            </h2>
            <p className="text-muted-foreground">
              Showing recent verified micro-disasters.
            </p>
          </div>
          <Link href="/create-alert">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Report Alert
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {verifiedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </main>
    </div>
  );
}

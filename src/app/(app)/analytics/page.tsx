'use client';

import { Header } from '@/components/header';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { useMemo } from 'react';
import { format, subDays } from 'date-fns';

export default function AnalyticsPage() {
  const { alerts } = useAuth();

  const alertsBySeverity = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    alerts.forEach(alert => {
      if (alert.severity in counts) {
        counts[alert.severity]++;
      }
    });
    return [
      { name: 'Low', count: counts.Low, fill: 'var(--color-low)' },
      { name: 'Medium', count: counts.Medium, fill: 'var(--color-medium)' },
      { name: 'High', count: counts.High, fill: 'var(--color-high)' },
    ];
  }, [alerts]);

  const alertsLast7Days = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), i);
        return {
            date: format(d, 'MMM dd'),
            name: format(d, 'eee'),
            count: 0,
        };
    }).reverse();

    alerts.forEach(alert => {
      const alertDateStr = format(new Date(alert.timestamp), 'MMM dd');
      const dayData = last7Days.find(d => d.date === alertDateStr);
      if (dayData) {
        dayData.count++;
      }
    });

    return last7Days;
  }, [alerts]);
  
  const chartConfigSeverity = {
    count: {
      label: 'Alerts',
    },
    low: {
      label: 'Low',
      color: 'hsl(var(--chart-2))',
    },
    medium: {
      label: 'Medium',
      color: 'hsl(var(--chart-4))',
    },
    high: {
      label: 'High',
      color: 'hsl(var(--destructive))',
    },
  };
  
  const chartConfigTimeline = {
    count: {
      label: 'Alerts',
      color: 'hsl(var(--primary))',
    },
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header title="Alert Analytics" />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Alerts by Severity</CardTitle>
                    <CardDescription>Distribution of alerts based on their severity level.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfigSeverity} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={alertsBySeverity}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="count" radius={4}>
                                {alertsBySeverity.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Alert Timeline (Last 7 Days)</CardTitle>
                    <CardDescription>Number of alerts reported over the past week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfigTimeline} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={alertsLast7Days}>
                             <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

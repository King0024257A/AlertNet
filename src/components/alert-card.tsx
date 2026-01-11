import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Alert } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, User, Clock } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const severityColors = {
  Low: 'bg-green-500 hover:bg-green-600',
  Medium: 'bg-yellow-500 hover:bg-yellow-600',
  High: 'bg-red-500 hover:bg-red-600',
};

export function AlertCard({ alert }: AlertCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={alert.imageUrl}
            alt={alert.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={alert.imageHint}
          />
           <Badge
            className={cn(
              "absolute top-2 right-2 border-none text-white",
              severityColors[alert.severity]
            )}
          >
            {alert.severity} Severity
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 font-headline text-lg">{alert.title}</CardTitle>
        <CardDescription>{alert.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 bg-muted/50 p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{alert.location}</span>
        </div>
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{alert.reportedBy}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}

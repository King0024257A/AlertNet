'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { verifyDisasterImage } from '@/ai/flows/verify-disaster-image';
import { alerts } from '@/lib/data'; // Mock data import

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  location: z.string().min(5, { message: 'Location must be at least 5 characters.' }),
  severity: z.enum(['Low', 'Medium', 'High']),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  photo: z.any().refine(file => file?.length > 0, 'An image is required.'),
});

export function CreateAlertForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      severity: 'Low',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create an alert.',
      });
      return;
    }

    setLoading(true);
    const file = values.photo[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;

      try {
        const verificationResult = await verifyDisasterImage({
          photoDataUri,
          description: values.description,
        });

        if (verificationResult.isDisaster) {
          // In a real app, this would be an API call to your backend.
          const newAlert = {
            id: String(Date.now()),
            title: values.title,
            description: values.description,
            location: values.location,
            severity: values.severity,
            imageUrl: URL.createObjectURL(file), // Using local URL for display
            imageHint: 'custom alert',
            reportedBy: user.name,
            timestamp: new Date(),
            isVerified: true,
          };
          alerts.unshift(newAlert); // Add to mock data

          toast({
            title: '✅ Alert Verified & Created!',
            description: 'Your report has been verified by AI and is now live.',
          });
          router.push('/dashboard');
        } else {
          toast({
            variant: 'destructive',
            title: '🚫 Alert Not Verified',
            description: `AI Reason: ${verificationResult.reason}`,
            duration: 9000,
          });
        }
      } catch (error) {
        console.error('Error verifying image:', error);
        toast({
          variant: 'destructive',
          title: 'An Error Occurred',
          description: 'Could not process the alert. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the uploaded image file.',
        });
        setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Fallen tree on Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, State, or specific address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a severity level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide details about the incident."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo of Incident</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
              </FormControl>
              <FormDescription>The image will be analyzed by AI to verify the disaster.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Analyzing & Submitting...' : 'Submit Alert'}
        </Button>
      </form>
    </Form>
  );
}

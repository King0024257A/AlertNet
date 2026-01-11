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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { verifyDisasterImage } from '@/ai/flows/verify-disaster-image';

const formSchema = z.object({
  location: z.string().min(5, { message: 'Location must be at least 5 characters.' }),
  photo: z.any().refine(file => file?.length > 0, 'An image is required.'),
});

export function CreateAlertForm() {
  const { user, addAlert } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
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
          description: "User submitted image for disaster verification.", // Generic description
        });

        if (verificationResult.isDisaster) {
          const newAlert = {
            id: String(Date.now()),
            title: verificationResult.title,
            description: verificationResult.description,
            location: values.location,
            severity: verificationResult.severity,
            imageUrl: URL.createObjectURL(file), // Using local URL for display
            imageHint: 'custom alert',
            reportedBy: user.name,
            timestamp: new Date(),
            isVerified: true,
          };
          addAlert(newAlert);

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
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo of Incident</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
              </FormControl>
              <FormDescription>The image will be analyzed by AI to verify the disaster and generate details.</FormDescription>
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

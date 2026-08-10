'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FileDown, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledDatePicker } from '@/components/form/ControlledDatePicker';

const recoverySchema = z.object({
  applicationNumber: z
    .string()
    .trim()
    .min(1, 'Application Number is required')
    .regex(/^Pharm D - \d+$/, 'Format must be: Pharm D - XXXX'),
  email: z.string().trim().email('Invalid email address'),
  dateOfBirth: z.date({
    message: 'Date of Birth is required',
  }),
});

type RecoveryFormValues = z.infer<typeof recoverySchema>;

interface RecoveryResult {
  applicationNumber: string;
  applicantName: string;
  recoveryToken: string;
}

export default function DownloadApplicationPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState<RecoveryResult | null>(null);

  const form = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      applicationNumber: '',
      email: '',
    },
  });

  const onSubmit = async (data: RecoveryFormValues) => {
    setIsVerifying(true);
    setResult(null);

    try {
      // Import format at the top of the file if needed, wait, we can just use simple string conversion or format if date-fns is imported.
      // Wait, date-fns format is not imported. I'll just use format because I can import it.
      // Let's use format from date-fns, wait, I need to make sure format is imported.
      // Actually, I can use a quick local extraction to send YYYY-MM-DD safely in local time.
      const dobDate = data.dateOfBirth;
      const dobString = `${dobDate.getFullYear()}-${String(dobDate.getMonth() + 1).padStart(2, '0')}-${String(dobDate.getDate()).padStart(2, '0')}`;

      const response = await fetch('/api/applications/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationNumber: data.applicationNumber,
          email: data.email,
          dateOfBirth: dobString, // Send as calendar string
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        toast.error(json.message || 'Unable to find an application with the provided details.');
        return;
      }

      setResult(json.data);
      toast.success('Application found successfully.');
    } catch (error) {
      toast.error('Something went wrong while retrieving the application. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    setIsDownloading(true);

    try {
      const response = await fetch(`/api/applications/recover/pdf?token=${result.recoveryToken}`);

      if (!response.ok) {
        toast.error('Unable to generate the PDF. Please try verifying again.');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.applicationNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success('Application PDF downloaded successfully.');
    } catch (error) {
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="space-y-2 text-center pb-8 border-b bg-slate-50/50 rounded-t-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileDown className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Retrieve Application
            </CardTitle>
            <CardDescription className="text-base max-w-[280px] mx-auto">
              Lost your previously downloaded PDF? Enter your details to retrieve it.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {!result ? (
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <ControlledInput
                    name="applicationNumber"
                    label="Application Number"
                    placeholder="Pharm D - XXXX"
                  />

                  <ControlledInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="applicant@example.com"
                  />

                  <ControlledDatePicker name="dateOfBirth" label="Date of Birth" />

                  <Button
                    type="submit"
                    className="w-full h-12 text-base rounded-lg mt-4 shadow-sm"
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Find Application
                      </>
                    )}
                  </Button>
                </form>
              </FormProvider>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 space-y-4 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg text-foreground mb-1">Application Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your application has been verified successfully.
                    </p>
                  </div>

                  <div className="bg-white rounded p-4 text-left border shadow-sm">
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <span className="text-muted-foreground">Application No.</span>
                      <span className="font-semibold text-right text-foreground">
                        {result.applicationNumber}
                      </span>

                      <span className="text-muted-foreground">Applicant</span>
                      <span
                        className="font-medium text-right text-foreground truncate pl-2"
                        title={result.applicantName}
                      >
                        {result.applicantName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full h-12 text-base rounded-lg shadow-sm group"
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                        Download Application PDF
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setResult(null);
                      form.reset();
                    }}
                  >
                    Look up another application
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

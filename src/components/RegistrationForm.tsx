'use client';

import { useState, useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Plus, Trash2, User, Crown } from 'lucide-react';

import { registrationSchema } from '@/lib/schemas';
import { registerParticipant } from '@/actions/register';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Check } from 'lucide-react';

type FormValues = z.infer<typeof registrationSchema>;

const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

export function RegistrationForm() {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            institutionName: '',
            place: '',
            district: '',
            candidates: [{ name: '', isLeader: true }], // Start with 1 candidate who is leader
            whatsappNumber: '',
            unionOfficialNumber: '',
            principalName: '',
            principalPhone: '',
            receiptUrl: '',
        },
    });

    const [uploading, setUploading] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        // Add institute name for better file naming if available
        const instituteName = form.getValues('institutionName');
        if (instituteName) formData.append('instituteName', instituteName);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Upload failed');

            setReceiptUrl(data.url);
            form.setValue('receiptUrl', data.url);
            toast.success('Receipt uploaded successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload receipt. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'candidates',
    });

    // Handle setting leader manually to ensure only one is selected
    const handleSetLeader = (index: number) => {
        const currentCandidates = form.getValues('candidates');
        const updatedCandidates = currentCandidates.map((c, i) => ({
            ...c,
            isLeader: i === index,
        }));
        form.setValue('candidates', updatedCandidates);
    };

    function onSubmit(data: FormValues) {
        if (data.candidates.filter(c => c.isLeader).length !== 1) {
            form.setError('candidates', { message: 'Please select exactly one Team Leader.' });
            return;
        }

        if (!data.receiptUrl) {
            toast.error('Please upload the payment receipt.');
            return;
        }

        startTransition(async () => {
            const result = await registerParticipant(data);

            if (result.success) {
                setIsSuccess(true);
                toast.success(result.message);
                form.reset();

                // Redirect to WhatsApp group after a short delay
                setTimeout(() => {
                    window.location.href = "https://chat.whatsapp.com/FQshIGaSZsJDYh9znLC8uz?mode=hqrt1";
                }, 2000);
            } else {
                toast.error(result.message);
                if (result.errors) {
                    // General errors or complex path errors
                    // Try to map fields
                    Object.entries(result.errors).forEach(([path, messages]) => {
                        // If path is candidates.0.name, form.setError can handle it
                        // @ts-ignore
                        form.setError(path, { message: messages[0] });
                    });
                    // Show global error if candidates array itself has issue
                    if (result.errors.candidates) {
                        form.setError('candidates', { message: result.errors.candidates[0] });
                    }
                }
            }
        });
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-lg mx-auto bg-green-950/20 border-green-500/20 backdrop-blur-md">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-malayalam text-green-400">Successfully Registered!</h2>
                        <p className="text-muted-foreground bg-green-900/10 p-2 rounded-lg inline-block">
                            Redirecting to WhatsApp group...
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => window.location.href = "https://chat.whatsapp.com/FQshIGaSZsJDYh9znLC8uz?mode=hqrt1"}
                        >
                            Join WhatsApp Group Now
                        </Button>

                        <Button
                            className="w-full border-green-500/30 text-green-300 hover:bg-green-900/40"
                            variant="outline"
                            onClick={() => setIsSuccess(false)}
                        >
                            Register Another Participant
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-3xl mx-auto border-white/5 bg-black/40 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="text-center text-3xl font-bold font-malayalam bg-linear-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                    Registration Form
                </CardTitle>
                <CardDescription className="text-center">
                    Team Registration (Max 5 Candidates)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Institution Name */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium leading-none">Name of Institution</label>
                            <Input
                                {...form.register('institutionName')}
                                placeholder="Enter Institution Name"
                                disabled={isPending}
                            />
                            {form.formState.errors.institutionName && (
                                <p className="text-sm text-red-500">{form.formState.errors.institutionName.message}</p>
                            )}
                        </div>

                        {/* Place */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Place</label>
                            <Input
                                {...form.register('place')}
                                placeholder="Place"
                                disabled={isPending}
                            />
                            {form.formState.errors.place && (
                                <p className="text-sm text-red-500">{form.formState.errors.place.message}</p>
                            )}
                        </div>

                        {/* District */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">District</label>
                            <div className="relative">
                                <select
                                    {...form.register('district')}
                                    disabled={isPending}
                                    className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                >
                                    <option value="">Select District</option>
                                    {districts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                            {form.formState.errors.district && (
                                <p className="text-sm text-red-500">{form.formState.errors.district.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none">Candidates (Team)</label>
                            <span className="text-xs text-muted-foreground">Select the Crown icon for Team Leader</span>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 space-y-3">
                            {fields.map((field, index) => {
                                const isLeader = form.watch(`candidates.${index}.isLeader`);
                                return (
                                    <div key={field.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-4 duration-300">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleSetLeader(index)}
                                            className={cn(
                                                "mt-0.5 transition-all hover:bg-transparent",
                                                isLeader ? "text-yellow-400 hover:text-yellow-300 scale-110" : "text-muted-foreground/30 hover:text-yellow-400/50"
                                            )}
                                            title={isLeader ? "Team Leader" : "Set as Team Leader"}
                                        >
                                            <Crown className={cn("w-5 h-5", isLeader && "fill-current")} />
                                        </Button>

                                        <div className="flex-1 space-y-1">
                                            <Input
                                                {...form.register(`candidates.${index}.name`)}
                                                placeholder={`Candidate ${index + 1} Name`}
                                                disabled={isPending}
                                                className={cn(isLeader ? "border-yellow-500/30 bg-yellow-500/5" : "")}
                                            />
                                            {form.formState.errors.candidates?.[index]?.name && (
                                                <p className="text-xs text-red-500">{form.formState.errors.candidates[index]?.name?.message}</p>
                                            )}
                                        </div>

                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    // If removing leader, set first remaining as leader or handle logic
                                                    // Simple logic: remove, if leader was removed, user must select new leader.
                                                    // Actually better: auto-set first as leader if leader removed?
                                                    // Let's just remove. Validation will force user to select leader if specific one removed.
                                                    // But wait, if index === leaderIndex? 
                                                    // Safer: remove then re-validate manually or let Zod handle it.
                                                    remove(index);
                                                    // If we just removed the leader, we might want to default 0 to leader?
                                                    // Let's leave it to user to select to avoid confusion. Zod will error "Select exactly one leader".
                                                }}
                                                className="text-muted-foreground hover:text-red-500 hover:bg-red-950/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}

                            {form.formState.errors.candidates?.root && (
                                <p className="text-sm text-red-500 text-center">{form.formState.errors.candidates.root.message}</p>
                            )}
                            {/* Zod array custom Error often comes in root or just under message if using refine */}
                            {form.formState.errors.candidates?.message && (
                                <p className="text-sm text-red-500 text-center">{form.formState.errors.candidates.message}</p>
                            )}

                            {fields.length < 5 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ name: '', isLeader: false })}
                                    className="w-full mt-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 text-muted-foreground"
                                    disabled={isPending}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Candidate
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* WhatsApp Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">WhatsApp Number</label>
                            <Input
                                {...form.register('whatsappNumber')}
                                placeholder="WhatsApp Number"
                                type="tel"
                                disabled={isPending}
                            />
                            {form.formState.errors.whatsappNumber && (
                                <p className="text-sm text-red-500">{form.formState.errors.whatsappNumber.message}</p>
                            )}
                        </div>

                        {/* Union Official Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Union Official Number</label>
                            <Input
                                {...form.register('unionOfficialNumber')}
                                placeholder="Official Phone Number"
                                type="tel"
                                disabled={isPending}
                            />
                            {form.formState.errors.unionOfficialNumber && (
                                <p className="text-sm text-red-500">{form.formState.errors.unionOfficialNumber.message}</p>
                            )}
                        </div>

                        {/* Principal Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Name of Principal</label>
                            <Input
                                {...form.register('principalName')}
                                placeholder="Principal Name"
                                disabled={isPending}
                            />
                            {form.formState.errors.principalName && (
                                <p className="text-sm text-red-500">{form.formState.errors.principalName.message}</p>
                            )}
                        </div>

                        {/* Principal Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Ph: Number of Principal</label>
                            <Input
                                {...form.register('principalPhone')}
                                placeholder="Principal Phone"
                                type="tel"
                                disabled={isPending}
                            />
                            {form.formState.errors.principalPhone && (
                                <p className="text-sm text-red-500">{form.formState.errors.principalPhone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 space-y-6">
                        <div className="flex items-center gap-3 border-b border-yellow-500/10 pb-4">
                            <div className="bg-yellow-500/20 p-2 rounded-full">
                                <span className="text-yellow-500 font-bold text-xl">₹</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-200">Registration Fee: ₹300</h3>
                                <p className="text-sm text-yellow-500/60">Scan the QR code to pay using any UPI app</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                            {/* QR Code */}
                            <div className="bg-white p-4 rounded-xl shadow-lg shrink-0">
                                <Image
                                    src="/qr-code.jpeg"
                                    alt="UPI QR Code"
                                    width={200}
                                    height={200}
                                    className="object-contain"
                                />
                                <p className="text-center text-black font-mono text-xs mt-2 font-bold">ubaidh4308@okicici</p>
                            </div>

                            {/* Upload Section */}
                            <div className="flex-1 space-y-4 w-full">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Upload Payment Receipt</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-full">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading || !!receiptUrl}
                                                className="cursor-pointer file:cursor-pointer file:text-yellow-500 file:border-0 file:bg-transparent file:font-semibold"
                                            />
                                            {uploading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md backdrop-blur-sm">
                                                    <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Upload a screenshot of the successful payment transaction.</p>
                                </div>

                                {receiptUrl && (
                                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                                        <Check className="w-5 h-5" />
                                        <span className="text-sm font-medium">Receipt Uploaded Successfully</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="ml-auto h-6 text-xs hover:text-red-400"
                                            onClick={() => {
                                                setReceiptUrl(null);
                                                form.setValue('receiptUrl', '');
                                            }}
                                        >
                                            Change
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full font-bold text-lg h-12 mt-6" variant="gold" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {isPending ? 'Registering...' : 'Submit Registration'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

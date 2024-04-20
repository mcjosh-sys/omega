"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Agency } from "@prisma/client"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { NumberInput } from "@tremor/react"
import { v4 } from "uuid"

import { useToast } from "../ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import FileUpload from "../global/file-upload"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"
import { deleteAgency, initUser, saveActivityAndNotify, updateAgencyDetails, upsertAgency } from "@/lib/queries"
import { Button } from "../ui/button"
import Loading from "@/components/global/loading"

interface AgencyDetailsProps {
    data?: Partial<Agency>
}

const FormSchema = z.object({
    name: z.string().min(2, { message: 'Agency name must be at least 2 chars.' }),
    companyEmail: z.string().email(),
    companyPhone: z.string().min(1),
    whiteLabel: z.boolean(),
    address: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    agencyLogo: z.string().min(1),
})


const AgencyDetails: React.FC<AgencyDetailsProps> = ({ data }) => {

    const { toast } = useToast()
    const router = useRouter()
    const [deletingAgency, setDeletingAgency] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: data?.id ? {
            name: data?.name,
            companyEmail: data?.companyEmail,
            companyPhone: data?.companyPhone,
            whiteLabel: data?.whiteLabel || false,
            address: data?.address,
            city: data?.city,
            zipCode: data?.zipCode,
            state: data?.state,
            country: data?.country,
            agencyLogo: data?.agencyLogo,
        } : {
            name: "",
            companyEmail: data?.companyEmail || "",
            companyPhone: "",
            whiteLabel: false,
            address: "",
            city: "",
            zipCode: "",
            state: "",
            country: "",
            agencyLogo: ""
        }
    })
    const isLoading = form.formState.isSubmitting

    // useEffect(() => {
    //     if (data) form.reset(data)
    // }, [data])

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        //console.log({values})
        try {
            let newUserData;
            let custId;
            if (!data?.id) {
                const bodyData = {
                    email: values.companyEmail,
                    name: values.name,
                    shipping: {
                        address: {
                            city: values.city,
                            country: values.country,
                            line1: values.address,
                            postal_code: values.zipCode,
                            state: values.zipCode,
                        },
                        name: values.name,
                    },
                    address: {
                        city: values.city,
                        country: values.country,
                        line1: values.address,
                        postal_code: values.zipCode,
                        state: values.zipCode,
                    },
                }
                await fetch('/api/stripe/create-customer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyData)
                })
                    .then(res => res.json())
                    .then(data => {
                        custId = data.customerId
                        //console.log({custId})
                    })

            }
            // WIP custId
            newUserData = await initUser({ role: 'AGENCY_OWNER' })
            if (!data?.customerId && !custId) {
                throw new Error('No customer id')
            }
                await upsertAgency({
                    id: data?.id ? data.id : v4(),
                    customerId: data?.customerId || custId || '',
                    address: values.address,
                    agencyLogo: values.agencyLogo,
                    city: values.city,
                    companyPhone: values.companyPhone,
                    country: values.country,
                    name: values.name,
                    state: values.state,
                    whiteLabel: values.whiteLabel,
                    zipCode: values.zipCode,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    companyEmail: values.companyEmail,
                    connectAccountId: '',
                    goal: 5,
                })

                toast({
                    title: `Agency ${data?.id ? 'Updated': 'Created'}`,
                    description: `Your agency has been ${data?.id ? 'updated': 'created'}`,
                })

                router.refresh()
            

        } catch (error) {
            console.log(error)
            toast({
                title: 'Oopsy!',
                description: 'There was a problem while creating your agency',
                variant: 'destructive'
            })
        }
    }

    const handleDeleteAgency = async () => {
        if (!data?.id) return
        setDeletingAgency(true)
        // WIP: discontinue the subscription 
        try {
            const response = deleteAgency(data.id)
            toast({
                title: 'Agency Deleted',
                description: 'Your agency and all sub accounts have been deleted',
            })
            router.push('/agency')
        } catch (error) {
            console.log(error)
            toast({
                title: 'Oopsy!',
                description: 'Could not delete your agency.',
            })

        }
        setDeletingAgency(false)
    }

    return (
        <AlertDialog>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        Agency Information
                    </CardTitle>
                    <CardDescription>
                        Let&apos;s create an agency for your business. You can edit agency settings later from the agency settings tab.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="agencyLogo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agency Logo</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                apiEndpoint="agencyLogo"
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Agency Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your agency name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="companyEmail"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Agency Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="companyPhone"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Agency Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your agency phone number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="whiteLabel"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                                        <div>
                                            <FormLabel>White Label</FormLabel>
                                            <FormDescription>
                                                Turning on white label mode will show your agency logo to all subsaccounts by default. You overwrite this functionality through the subaccount settings.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123 st..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="City"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="State"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Zip Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Zip code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Country"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {data?.id && <div className="flex flex-col gap-2">
                                <FormLabel>Set A Goal</FormLabel>
                                <FormDescription>
                                    ✨ Set a goal for your agency. Elevate your agency&apos;s trajectory! With growth comes greater aspirations—don&apos;t hesitate to set the bar high and reach for the stars. Your goals fuel your journey to success!
                                </FormDescription>
                                <NumberInput
                                    defaultValue={data.goal}
                                    onValueChange={async (val) => {
                                        if (!data.id) return
                                        await updateAgencyDetails(data.id, { goal: val })
                                        await saveActivityAndNotify({
                                            agencyId: data.id,
                                            desc: `Updated the agency goal to | ${val} Sub Account`,
                                            subaccountId: undefined
                                        })
                                        router.refresh()
                                    }}
                                    min={1}
                                    className="bg-background !border !border-input"
                                    placeholder="Sub Account Goal"
                                />
                            </div>}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center"
                            >
                                {isLoading ? <Loading /> :
                                    data?.id ? "Save Agency Information" : "Create Agency"}
                            </Button>
                        </form>
                    </Form>
                    {data?.id && (
                        <div className="flex items-center justify-between rounded-lg border-destructive gap-4 p-4 mt-4">
                            <div>
                                <div>Danger Zone</div>
                            </div>
                            <div className="text-muted-foreground">
                                Deleting your agency cannot be undone. This will also delete all sub accounts and all data related to your sub accounts. Sub accounts will no longer have access to funnels, contacts, etc.
                            </div>
                            <AlertDialogTrigger
                                disabled={isLoading || deletingAgency}
                                className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                            >
                                {deletingAgency ? "Deleting..." : "Delete Agency"}
                            </AlertDialogTrigger>
                        </div>
                    )}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-left">
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                                This action cannot be undone. This will permanently delete the
                                Agency account and all related sub accounts.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                            <AlertDialogCancel className="transition-colors duration-500">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deletingAgency}
                                className="bg-destructive hover:bg-red-600 transition-colors duration-500"
                                onClick={handleDeleteAgency}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </CardContent>
            </Card>
        </AlertDialog>
    )
}

export default AgencyDetails
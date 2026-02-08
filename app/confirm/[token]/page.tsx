import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ token: string }>;
}

export default async function ConfirmRedirect({ params }: Props) {
    const { token } = await params;
    redirect(`/onboarding?invite=${token}`);
}

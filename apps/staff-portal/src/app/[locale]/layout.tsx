import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../../app/globals.css"; // Point to your global CSS
import { ApolloWrapper } from '@/lib/apolloWrapper';
export const metadata = {
    title: "Snaptuki Staff Portal",
    description: "Elder-care management platform",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // 1. Await params (Required in Next.js 15+)
    const { locale } = await params;

    // 2. Validate that the incoming `locale` is valid
    if (!['en', 'fi', 'sv'].includes(locale)) {
        notFound();
    }

    // 3. Fetch messages on the server side
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className="antialiased bg-slate-50 text-slate-900">
                {/* 4. Wrap app in NextIntlClientProvider to make messages available to Client Components */}
                <NextIntlClientProvider messages={messages}>
                    <ApolloWrapper>

                        {children}
                    </ApolloWrapper>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
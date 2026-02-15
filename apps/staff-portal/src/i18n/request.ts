import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
 
// Updated to include your new languages
const locales = ['en', 'fi', 'sv'];
 
export default getRequestConfig(async ({requestLocale}) => {
  // In newer Next.js versions, this is a Promise that needs awaiting
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }
 
  return {
    locale, // <--- THE FIX: This property is required
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
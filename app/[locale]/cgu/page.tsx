import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CGU' });
  return {
    title: t('title'),
  };
}

export default function CGUPage() {
  const t = useTranslations('CGU');

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost">
            ← {t('backToHome')}
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('lastUpdated')}</p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <p className="text-lg italic">{t('intro')}</p>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.definition.title')}</h2>
          <p>{t('sections.definition.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.privacy.title')}</h2>
          <p>{t('sections.privacy.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.content.title')}</h2>
          <p>{t('sections.content.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.moderation.title')}</h2>
          <p>{t('sections.moderation.content')}</p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t text-center">
        <Link href="/">
          <Button>{t('backToHome')}</Button>
        </Link>
      </div>
    </div>
  );
}

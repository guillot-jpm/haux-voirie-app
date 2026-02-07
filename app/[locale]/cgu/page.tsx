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

        {/* 1. MENTIONS LÉGALES */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.legal.title')}</h2>
          <div className="whitespace-pre-line text-justify">
            {t('sections.legal.content')}
          </div>
        </section>

        {/* 2. ACCÈS */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.access.title')}</h2>
          <div className="whitespace-pre-line text-justify">
            {t('sections.access.content')}
          </div>
        </section>

        {/* 3. RGPD */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.privacy.title')}</h2>
          <div className="whitespace-pre-line text-justify">
            {t('sections.privacy.content')}
          </div>
        </section>

        {/* 4. MODÉRATION */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.moderation.title')}</h2>
          <div className="whitespace-pre-line text-justify">
            {t('sections.moderation.content')}
          </div>
        </section>

        {/* 5. RESPONSABILITÉ */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.responsibility.title')}</h2>
          <div className="whitespace-pre-line text-justify">
            {t('sections.responsibility.content')}
          </div>
        </section>

        {/* 6. PROPRIÉTÉ INTELLECTUELLE */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.ip.title')}</h2>
          <div className="whitespace-pre-line text-justify">
            {t('sections.ip.content')}
          </div>
        </section>

        {/* 7. ÉVOLUTION DES CGU (Nouvelle section) */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.evolution.title')}</h2>
          <div className="whitespace-pre-line text-justify">
            {t('sections.evolution.content')}
          </div>
        </section>

        {/* 8. LOI APPLICABLE (Anciennement 7) */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('sections.jurisdiction.title')}</h2>
          <div className="whitespace-pre-line text-justify">
            {t('sections.jurisdiction.content')}
          </div>
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

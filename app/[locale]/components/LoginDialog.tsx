"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function LoginDialog() {
  const t = useTranslations('LoginPage');
  const [email, setEmail] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("email", { email, redirect: false });
    setIsEmailSubmitted(true);
    toast({
      title: "Vérifiez votre boîte de réception",
      description: "Un lien de connexion a été envoyé à votre adresse e-mail.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t('signInButton')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('signIn')}</DialogTitle>
          <DialogDescription>
            {t('signInDescription')}
          </DialogDescription>
        </DialogHeader>
        {isEmailSubmitted ? (
          <div className="text-center p-4">
            <p>{t('checkYourEmail')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={() => signIn("google")}
              className="w-full"
            >
              {t('signInWithGoogle')}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('orContinueWith')}
                </span>
              </div>
            </div>
            <form onSubmit={handleEmailSignIn} className="space-y-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                {t('sendLoginLink')}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

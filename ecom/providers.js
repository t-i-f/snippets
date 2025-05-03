// app/providers.js
"use client"

import { HeroUIProvider } from '@heroui/react';
import { ReCaptchaProvider } from 'next-recaptcha-v3';

export function Providers({ children }) {
  return (
    <ReCaptchaProvider reCaptchaKey="{{captcha}}">
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </ReCaptchaProvider>
  )
}
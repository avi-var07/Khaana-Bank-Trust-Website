export async function verifyCaptchaToken(captchaToken, request, action = 'generic') {
  const provider = (process.env.CAPTCHA_PROVIDER || '').toLowerCase();

  // If provider is not configured, skip enforcement to avoid breaking existing forms.
  if (!provider) {
    return { success: true, skipped: true };
  }

  if (!captchaToken) {
    return { success: false, error: 'Captcha token is required.' };
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';

  if (provider === 'turnstile') {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return { success: false, error: 'Turnstile is not configured on server.' };
    }

    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', captchaToken);
    if (ip) body.set('remoteip', ip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: `Captcha validation failed for ${action}.` };
    }

    return { success: true };
  }

  if (provider === 'recaptcha') {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return { success: false, error: 'reCAPTCHA is not configured on server.' };
    }

    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', captchaToken);
    if (ip) body.set('remoteip', ip);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: `Captcha validation failed for ${action}.` };
    }

    return { success: true };
  }

  return { success: false, error: 'Unsupported CAPTCHA_PROVIDER. Use turnstile or recaptcha.' };
}

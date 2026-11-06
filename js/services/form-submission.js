import { CONFIG } from './config.js?v=2.0.0';

// Keep provider-specific fields and confirmation rules consistent for every form.
export async function submitWeb3Form(formData) {
  for (const name of ['botcheck', '_gotcha']) {
    if (formData.getAll(name).some(value => typeof value !== 'string' || value.trim())) {
      throw new Error('Submission could not be processed.');
    }
  }
  const payload = new FormData();
  for (const [name, value] of formData) payload.append(name, value);
  payload.set('access_key', CONFIG.WEB3FORMS_ACCESS_KEY);
  if (payload.has('_subject') && !payload.has('subject')) payload.set('subject', payload.get('_subject'));
  payload.delete('_subject');
  payload.delete('_gotcha');
  payload.delete('redirect'); // AJAX stays on the current page.
  const response = await fetch(CONFIG.WEB3FORMS_ENDPOINT, {
    method: 'POST', body: payload, signal: AbortSignal.timeout(20000),
    redirect: 'error', credentials: 'omit',
    headers: { Accept: 'application/json' },
  });
  const result = await response.json().catch(() => null);
  return { response, result, success: response.ok && result?.success === true };
}

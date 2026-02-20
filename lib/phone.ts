export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, '');

  if (digits.length < 10 || digits.length > 13) {
    throw new Error('Telefone inválido.');
  }

  const withoutCountryCode = digits.startsWith('55') ? digits.slice(2) : digits;

  if (withoutCountryCode.length < 10 || withoutCountryCode.length > 11) {
    throw new Error('Telefone precisa ter DDD + número.');
  }

  return `55${withoutCountryCode}`;
}

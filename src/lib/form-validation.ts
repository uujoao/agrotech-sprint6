const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PART_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,}$/;
const PHONE_REGEX = /^[1-9]{2}9\d{8}$/;

export const MAX_MESSAGE_LENGTH = 500;

export type FieldErrors<T extends string> = Record<T, string | null>;

export function formatTelefoneBR(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validarNome(value: string): string | null {
  const nome = value.trim();

  if (!nome) return "O nome completo não pode ficar em branco.";

  const partes = nome.split(/\s+/).filter(Boolean);
  if (partes.length < 2) return "Digite nome e sobrenome.";
  if (!partes.every((parte) => NAME_PART_REGEX.test(parte))) {
    return "Digite nome e sobrenome usando apenas letras válidas.";
  }

  return null;
}

export function validarEmail(value: string): string | null {
  const email = value.trim();

  if (!email) return "O e-mail não pode ficar em branco.";
  if (!EMAIL_REGEX.test(email)) {
    return "Informe um e-mail válido, por exemplo: nome@dominio.com.";
  }

  return null;
}

export function validarTelefone(value: string): string | null {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "O telefone/WhatsApp é obrigatório.";
  if (!PHONE_REGEX.test(digits)) {
    return "Informe um celular completo no formato (XX) 9XXXX-XXXX.";
  }

  // Evita aceitar sequências obviamente inválidas como (11) 99999-9999.
  if (/^(\d)\1{10}$/.test(digits)) {
    return "Informe um número de celular válido.";
  }

  return null;
}

export function validarMensagem(value: string): string | null {
  const mensagem = value.trim();

  if (!mensagem) return "A mensagem não pode ficar em branco.";
  if (value.length > MAX_MESSAGE_LENGTH) {
    return `A mensagem deve ter no máximo ${MAX_MESSAGE_LENGTH} caracteres.`;
  }

  return null;
}

export function validarCidade(value: string): string | null {
  if (!value.trim()) return "A cidade/estado não pode ficar em branco.";
  return null;
}

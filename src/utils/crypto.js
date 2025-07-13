
// Utilitaires de chiffrement pour les mots de passe
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const verifyPassword = async (password, hashedPassword) => {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
};

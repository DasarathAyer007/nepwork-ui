export const getPasswordStrength = (password: string) => {
  let score = 0;

  if (!password) return 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;

  const symbols = password.match(/[^a-zA-Z0-9]/g) || [];
  if (symbols.length >= 1) score++;
  if (symbols.length >= 2) score++;

  const uniqueSymbols = new Set(symbols).size;
  if (uniqueSymbols >= 2) score++;

  if (/(.)\1{2,}/.test(password)) score = Math.max(0, score - 2); // 3+ repeating chars
  if (
    /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789|890|qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn)/i.test(
      password
    )
  ) {
    score = Math.max(0, score - 1);
  }

  return score;
};

export const getStrengthLabel = (score: number) => {
  if (score <= 1) {
    return { label: 'Very Weak', color: 'bg-error' };
  }

  if (score === 2) {
    return { label: 'Weak', color: 'bg-error' };
  }

  if (score === 3) {
    return { label: 'Fair', color: 'bg-tertiary' };
  }

  if (score === 4) {
    return { label: 'Good', color: 'bg-secondary' };
  }

  if (score === 5) {
    return { label: 'Strong', color: 'bg-primary-container' };
  }

  return {
    label: 'Very Strong',
    color: 'bg-primary',
  };
};

export const getStrengthPercent = (score: number) => {
  return Math.min((score / 6) * 100, 100);
};

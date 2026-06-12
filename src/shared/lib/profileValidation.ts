const PHONE_PATTERN = /^\+?[0-9][0-9\s().-]{6,20}[0-9]$/;

export function validateDisplayName(fullName: string) {
  const value = fullName.trim();
  if (!value) return 'Enter a display name.';
  if (value.length < 3) return 'Display name must be at least 3 characters.';
  if (value.length > 40) return 'Display name must be 40 characters or fewer.';
  return '';
}

export function validatePhone(phone: string) {
  const value = phone.trim();
  if (!value) return '';
  if (!PHONE_PATTERN.test(value)) {
    return 'Enter a valid phone number, or leave this field empty.';
  }

  const digitCount = value.replace(/\D/g, '').length;
  if (digitCount < 7 || digitCount > 15) {
    return 'Phone number must contain 7-15 digits.';
  }

  return '';
}

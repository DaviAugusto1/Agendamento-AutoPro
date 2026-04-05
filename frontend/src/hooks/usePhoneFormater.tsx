export function formatPhoneMain(value: string) {
    const numbers = value.replaceAll(/\D/g, "");
    const with9 = numbers.startsWith("9") ? numbers : "9" + numbers;
    const limited = with9.slice(0, 9);
    if (limited.length <= 5) return limited;
    return `${limited.slice(0, 5)}-${limited.slice(5, 9)}`;
  }
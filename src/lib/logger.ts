export function devLog(tag: string, ...args: unknown[]) {
  if (import.meta.env && (import.meta.env as any).DEV) {
    // Slight styling to make logs stand out
    // eslint-disable-next-line no-console
    console.log(`%c[${tag}]`, 'color:#60a5fa;font-weight:bold', ...args);
  }
}



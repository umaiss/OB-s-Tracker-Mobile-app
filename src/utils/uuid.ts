export { uuidv4 as v4 };

export function uuidv4(): string {
  const bytes: number[] = [];
  for (let i = 0; i < 16; i += 1) {
    bytes.push(Math.floor(Math.random() * 256));
  }

  // version 4
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // variant 10xx
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.map(b => b.toString(16).padStart(2, '0'));

  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
}

export const DEFAULT_NAME_TAGS = [
  '친절한',
  '아름다운',
  '귀여운',
  '치명적인',
  '달콤한',
  '강력한',
] as const;

export function getRandomNameTag(): string {
  return DEFAULT_NAME_TAGS[Math.floor(Math.random() * DEFAULT_NAME_TAGS.length)];
}

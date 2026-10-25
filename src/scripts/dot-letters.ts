// "Luca Picci" drawn on a dot grid with hand-made letters: 7 rows, lowercase in the bottom 5.
const GLYPHS: Record<string, string[]> = {
  L: ['1000', '1000', '1000', '1000', '1000', '1000', '1111'],
  u: ['0000', '0000', '1001', '1001', '1001', '1001', '0110'],
  c: ['0000', '0000', '0111', '1000', '1000', '1000', '0111'],
  a: ['0000', '0000', '0110', '0001', '0111', '1001', '0111'],
  P: ['1110', '1001', '1001', '1110', '1000', '1000', '1000'],
  i: ['1', '0', '1', '1', '1', '1', '1'],
  ' ': ['00', '00', '00', '00', '00', '00', '00'],
};

export const NAME = 'Luca Picci';
export const ROWS = 7;

/** The name's dots as grid cells, and the grid's width in columns. */
export function nameDots(): { dots: [number, number][]; cols: number } {
  const dots: [number, number][] = [];
  let col = 0;
  for (const ch of NAME) {
    GLYPHS[ch].forEach((row, y) =>
      [...row].forEach((on, x) => {
        if (on === '1') dots.push([col + x, y]);
      }),
    );
    col += GLYPHS[ch][0].length + 1;
  }
  return { dots, cols: col - 1 };
}

/** The name as lines of text, for the console. */
export function nameArt(on = '●', off = ' '): string[] {
  return Array.from({ length: ROWS }, (_, y) =>
    [...NAME].map((ch) => GLYPHS[ch][y].replace(/1/g, on).replace(/0/g, off)).join(off),
  );
}

import type { Row } from '../../data/types';
import LargeRow from './LargeRow.astro';
import PairRow from './PairRow.astro';
import GroupRow from './GroupRow.astro';

/** The component for each kind of row. Each one receives its own row and the page's language. */
export const rowComponents: Record<Row['kind'], (props: any) => any> = {
  large: LargeRow,
  pair: PairRow,
  group: GroupRow,
};

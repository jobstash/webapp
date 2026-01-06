import { filterIconMap } from './filter-icon-map';

interface Props {
  paramKey: string;
}

export const FilterIcon = ({ paramKey }: Props) => {
  return filterIconMap[paramKey];
};

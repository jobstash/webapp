import { filterIconMap } from './filter-icon-map';

interface Props {
  paramKey: string;
}

export const MappedFilterIcon = ({ paramKey }: Props): React.ReactNode => {
  return filterIconMap[paramKey];
};

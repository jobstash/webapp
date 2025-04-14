export const getLabelByOptionValue = (
  options: { label: string; value: string }[],
  value: string,
) => {
  return options.find((option) => option.value === value)?.label;
};

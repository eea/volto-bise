import { format } from 'd3';

const FormattedValue = ({ textTemplate, specifier, value }) => {
  if (specifier) {
    const formatter = format(specifier);
    value = formatter(value);
  }
  if (textTemplate) {
    value = textTemplate.replace('{}', value);
  }
  return value;
};

export default FormattedValue;

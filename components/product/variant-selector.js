import { h } from 'preact';

const VariantSelector = ({
  currentVariant,
  option,
  setCurrentVariant,
  variants,
}) => {
  const optionId = `product-option-${option.name}`;

  const handleVariantChange = (e) => {
    const updatedOption = e.target.dataset.optionName;
    const selectedOptions = currentVariant.selectedOptions.map((o) =>
      o.name === updatedOption
        ? { name: updatedOption, value: e.target.value }
        : o,
    );
    const newVariant = variants.find(
      (v) =>
        JSON.stringify(v.selectedOptions) === JSON.stringify(selectedOptions),
    );

    setCurrentVariant(newVariant);
  };

  return (
    <div>
      <label htmlFor={optionId} className="block">
        {option.name}
      </label>
      <select
        id={optionId}
        name={optionId}
        className="block w-full py-2 pl-3 pr-10 mt-1 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        onChange={handleVariantChange}
        data-option-name={option.name}
      >
        {option.values.map((value) => (
          <option
            key={`${optionId}-${value}`}
            value={value}
            selected={currentVariant.selectedOptions.find(
              (o) => o.name === option.name && o.value === value,
            )}
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VariantSelector;

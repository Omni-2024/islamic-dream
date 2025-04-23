import Select from "react-select";

const CustomSelect = ({ options, value, onChange, name, placeholder }) => (
  <Select
    options={options}
    value={value}
    onChange={onChange}
    placeholder={`  ${placeholder}`}
    className="text-sm w-full bg-transparent"
    isClearable={true}
    styles={{
      control: (base, state) => ({
        ...base,
        border: 'none',
        boxShadow: 'none',
        backgroundColor: state.isFocused ? 'white' : 'transparent'
      }),
      dropdownIndicator: (base) => ({
        ...base,
        display: 'none'
      }),
      clearIndicator: (base) => ({
        ...base,
        cursor: 'pointer',
        color: '#a0aec0',
        '&:hover': {
          color: '#4A5568'
        }
      }),
      indicatorSeparator: (base) => ({
        ...base,
        display: 'none'
      }),
      placeholder: (base) => ({
        ...base,
        color: '#a0aec0', 
        paddingLeft: '10px'
      }),
      singleValue: (base) => ({
        ...base,
        paddingLeft: '10px'
      }),
      menu: (base) => ({
        ...base,
        position: 'absolute',
        zIndex: 9999
      })
    }}
    onMenuOpen={() => window.scrollTo(0, 0)}
  />
);

export default CustomSelect;
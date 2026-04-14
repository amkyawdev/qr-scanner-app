/**
 * Glass styled input component
 */
const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  id,
  name
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      id={id}
      name={name}
      className={`input-glass w-full ${className}`}
    />
  );
};

export default Input;
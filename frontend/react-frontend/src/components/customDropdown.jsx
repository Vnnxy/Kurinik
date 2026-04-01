import { useEffect, useState } from 'react';

export default function CustomDropdown({ options = [], name, value, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Sync `value` prop to state when it changes
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setSelectedValue(value);
      setInputValue('');
    }
  }, [value]);

  const handleOptionClick = (option) => {
    if (disabled) return;
    setSelectedValue(option);
    setInputValue('');
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    if (disabled) return;
    setSelectedValue('');
    setInputValue(e.target.value);
  };

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const currentValue = selectedValue || inputValue;

  return (
    <div className={`dropdown relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div
        className="dropdown-header border p-2 cursor-pointer bg-white"
        onClick={toggleDropdown}
      >
        {currentValue || 'Selecciona o Escribe...'}
      </div>

      {isOpen && !disabled && (
        <div className="dropdown-list absolute z-10 bg-white border mt-1 w-full shadow">
          {options.map((option) => (
            <div
              key={option}
              className="dropdown-item px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
          <input
            type="text"
            className="dropdown-input w-full border-t p-2"
            placeholder="Escribe el motivo..."
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={currentValue} />
    </div>
  );
}

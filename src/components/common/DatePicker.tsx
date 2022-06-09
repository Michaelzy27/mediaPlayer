import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

interface IDatePickerProps {
  onChange?: (value: string) => void;
  value?: string;
  minValue?: string;
  maxValue?: string;
  className?: string;
  ariaLabel?: string;
  id?: string;
}

// antd's date picker is not accessible.
// use native accessible date picker
const DatePicker = ({
  onChange,
  value,
  minValue,
  maxValue,
  className,
  ariaLabel,
  id,
}: IDatePickerProps) => {
  const [internalValue, setInternalValue] = useState<string>('');

  const isoDate = (dt: string | null | undefined) => {
    if (dt) {
      return dayjs(dt)?.format('YYYY-MM-DD') || '';
    }
    return '';
  };

  useEffect(() => {
    if (value) {
      setInternalValue(isoDate(value));
    }
  }, [value]);

  const handleChange = useCallback((e: any) => {
    setInternalValue(e.target.value);
  }, []);

  const triggerChange = useCallback(() => {
    // don't trigger on change until user leaves the field
    if (onChange) {
      onChange(isoDate(internalValue));
    }
  }, [internalValue, onChange]);

  return (
    <input
      type="date"
      id={id}
      onChange={handleChange}
      onBlur={triggerChange}
      onSelect={triggerChange}
      aria-label={ariaLabel}
      value={internalValue}
      min={isoDate(minValue)}
      max={isoDate(maxValue)}
      className={`ant-input ${className || ''}`}
    ></input>
  );
};

export default DatePicker;

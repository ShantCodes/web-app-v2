import { Autocomplete, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Icon } from 'src/Nowruz/general/Icon';

import Chip from './chip';
import css from './multiSelect.module.scss';
import { MultiSelectItem, MultiSelectProps } from './multiSelect.types';

const MultiSelect: React.FC<MultiSelectProps> = (props) => {
  const {
    id,
    searchTitle,
    items,
    maxLabel,
    max,
    placeholder,
    componentValue,
    setComponentValue,
    customHeight,
    chipBorderColor,
    chipBgColor,
    chipFontColor,
    chipIconColor,
    popularLabel = true,
    displayDefaultBadges = true,
    errors,
  } = props;
  const [chipItems, setChipItems] = useState(items);
  const [searchVal, setSearchVal] = useState('');

  function filterItems(val: string) {
    setSearchVal(val);
    setChipItems(
      items
        ?.filter((item) => !componentValue.map((cv) => cv.value).includes(item.value))
        .filter((item) => item.label.toLowerCase().includes(val.toLowerCase())),
    );
  }

  function handleChange(val: string[]) {
    const lastItem = val[val.length - 1];
    const newVal = items?.find(
      (i) =>
        i.label.toLowerCase() === lastItem.toLowerCase() &&
        !componentValue.map((i) => i.label.toLowerCase()).includes(lastItem.toLowerCase()),
    );
    if (newVal) setComponentValue([...componentValue, newVal]);
    else setChipItems(items?.filter((i) => !componentValue?.includes(i)));
  }

  function add(value: string, label: string) {
    setSearchVal('');
    const existed = componentValue.find((item) => item.value === value || item.label === label);
    if (!existed && componentValue?.length < (max || 0)) setComponentValue([...componentValue, { value, label }]);
  }

  function remove(val: string) {
    setSearchVal('');
    setComponentValue(componentValue?.filter((item) => item.label !== val));
  }

  useEffect(() => {
    setChipItems(items?.filter((i) => !componentValue.map((cv) => cv.value).includes(i.value)));
  }, [componentValue]);

  return (
    <div className={css.container}>
      <label htmlFor={id} aria-describedby={id} className={css.searchTitle}>
        {searchTitle}
      </label>
      <Autocomplete
        id={id}
        value={componentValue}
        onChange={(event, value) => handleChange(value)}
        clearIcon={false}
        options={[]}
        freeSolo
        autoSelect
        multiple
        renderTags={(value, props) =>
          value.map((option, index) => (
            <Chip
              id={option.value}
              label={option.label}
              icon={<Icon name="x-close" fontSize={12} color={chipIconColor} />}
              {...props({ index })}
              onClick={remove}
              bgColor={chipBgColor}
              borderColor={chipBorderColor}
              fontColor={chipFontColor}
              customStyle="m-[3px]"
            />
          ))
        }
        disabled={componentValue?.length >= (max || 0)}
        renderInput={(params) => (
          <div className={css.inputContainer}>
            <TextField
              variant="outlined"
              label=""
              placeholder={componentValue?.length ? '' : placeholder}
              onChange={(e) => filterItems(e.target.value)}
              {...params}
            />
          </div>
        )}
      />
      <div className={css.captionDiv}>
        {errors &&
          errors.map((e, index) => (
            <p key={index} className={`${css.errorMsg}`}>
              {e}
            </p>
          ))}
        <Typography variant="subtitle1" className={css.popularLabel}>
          {maxLabel}
        </Typography>
      </div>

      {popularLabel && (
        <div className={css.popularDiv}>
          <Typography variant="caption" className={css.popularLabel}>
            Popular
          </Typography>
        </div>
      )}
      {(displayDefaultBadges || searchVal) && (
        <div className={css.chipContainer} style={customHeight ? { height: customHeight, overflowY: 'auto' } : {}}>
          {chipItems?.map((i) => (
            <Chip
              key={i.value}
              id={i.value}
              label={i.label}
              icon={<Icon name="plus" fontSize={12} color={chipIconColor} />}
              onClick={() => add(i.value, i.label)}
              bgColor={chipBgColor}
              borderColor={chipBorderColor}
              fontColor={chipFontColor}
              customStyle="m-1"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

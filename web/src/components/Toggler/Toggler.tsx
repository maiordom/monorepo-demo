import React, { useState } from 'react';

import TableButton from 'ui-kit/components/TableButton';

interface IProps {
  className?: string;
  icon: string;
  title: string;
  items: {
    name: string;
    value: string;
  }[];
  onToggle?: (isToggled: boolean) => void;
}

import css from './Toggler.css';

export default ({ title, icon, items, className, onToggle }: IProps) => {
  const [isToggled, toggle] = useState(false);

  const handleClick = () => {
    toggle(!isToggled);
    onToggle && onToggle(!isToggled);
  };

  return (
    <>
      <TableButton
        isToggled={isToggled}
        onClick={handleClick}
        title={title}
        className={className}
        icon={icon}
      />
      {isToggled && (
        <div className={css.items}>
          {items.map(item => (
            <div key={item.name + item.value} className={css.item}>
              <div className={css.name}>{item.name}</div>
              <div className={css.value}>{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

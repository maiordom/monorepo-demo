import React from 'react';

import { Belt } from 'src/components/Layout';
import List from 'ui-kit/components/List';

import css from './Features.css';

export interface IFeature {
  type: string;
  value: string;
  name?: string;
}

interface IProps {
  items: IFeature[];
}

const links = {
  moreInfo: 'https://tabby.ai',
};

export default ({ items }: IProps) => (
  <div className={css.container}>
    <Belt>
      <List className={css.list}>
        {items.map(item => (
          <li key={item.value}>
            {item.type === 'text' ? (
              item.value
            ) : (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={links[item.name]}
              >
                {item.value}
              </a>
            )}
          </li>
        ))}
      </List>
    </Belt>
  </div>
);

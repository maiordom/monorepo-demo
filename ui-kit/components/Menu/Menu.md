```jsx
import { BrowserRouter as Router } from 'react-router-dom';

<Router>
  <div style={{ background: '#292929', width: 300 }}>
    <Menu
      onActive={() => {}}
      items={[
        {
          type: 'nav',
          name: 'home',
          path: '/menu/',
          title: 'Home',
          exact: true,
          strict: true,
        },
        {
          type: 'nav',
          name: 'profile',
          path: '/menu/profile',
          title: 'Profile',
          strict: true,
          exact: true,
        },
        {
          type: 'nav',

          name: 'support',
          path: '/menu/support',
          title: 'Support',
          strict: true,
          exact: true,
        },
      ]}
    />
  </div>
</Router>;
```

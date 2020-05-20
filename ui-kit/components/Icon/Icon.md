```jsx
const style = { margin: '10px 10px 0 0' };

<div>
  <div>
    <Icon style={style} name="home" />
    <Icon style={style} name="home-active" />
    <Icon style={style} name="profile" />
    <Icon style={style} name="profile-active" />
    <Icon style={style} name="support" />
    <Icon style={style} name="support-active" />
    <Icon style={style} name="burger" />
    <Icon style={style} name="close-small" />
    <Icon style={style} name="close-large" />
    <Icon style={style} name="warning" />
    <Icon style={style} name="status-default" />
    <Icon style={style} name="status-paid" />
    <Icon style={style} name="status-success" />
  </div>

  <div>
    <Icon style={{ ...style, width: 44, height: 44 }} name="arrow-left" />
    <Icon style={{ ...style, width: 44, height: 44 }} name="arrow-right" />
  </div>
</div>;
```

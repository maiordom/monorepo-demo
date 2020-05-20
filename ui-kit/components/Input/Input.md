```js
<div>
  <Input
    value="+971500000001"
    onChange={() => {}}
    placeholder="Your placeholder"
    formatOptions={{
      regex: '\\+971 [1-9]\\d-\\d\\d\\d-\\d\\d\\d\\d',
      placeholder: '_',
    }}
  />

  <div style={{ marginTop: 30 }}>
    <Input onChange={() => {}} status="accepted" placeholder="Your phone" />
  </div>

  <div style={{ marginTop: 30 }}>
    <Input
      onChange={() => {}}
      title="Enter you national id"
      placeholder="National id"
    />
  </div>

  <div style={{ marginTop: 30, padding: 30, background: '#292929' }}>
    <Input
      theme="white"
      onChange={() => {}}
      title="Enter you national id"
      placeholder="National id"
    />
  </div>
</div>
```

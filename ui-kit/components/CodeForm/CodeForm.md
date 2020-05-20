```js
<div style={{ textAlign: 'center' }}>
  <CodeForm
    status="pending"
    onCodeFocus={() => {}}
    onCodeFulfilled={() => {}}
    i18n={{
      title: 'Enter your code',
      sendAnotherCode: 'Send another code',
      wrongCode: 'Incorrect code',
      somethingWrong: 'Something wrong',
      attempts: attempts => `You have ${attempts} attempts left`,
    }}
  />
</div>
```

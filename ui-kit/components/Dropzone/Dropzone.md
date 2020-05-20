```jsx
<div>
  <div style={{ maxWidth: 495, height: 380 }}>
    <Dropzone
      i18n={{
        title: ['Drag and drop an image', 'or {{browse}} to choose a file'],
        callToAction: 'browse',
        description: '(The file size should not exceed 20Mb)',
      }}
      onChange={() => {}}
    />
  </div>
  <div style={{ maxWidth: 495, height: 380, marginTop: 50 }}>
    <Dropzone
      isLoading
      i18n={{
        title: ['Drag and drop an image', 'or {{browse}} to choose a file'],
        callToAction: 'browse',
        description: '(The file size should not exceed 20Mb)',
      }}
      onChange={() => {}}
    />
  </div>
</div>
```

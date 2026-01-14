# Open-Closed Principle in React

**Statement:** Components should be open for extension but closed for modification.

**Rule:** Use component composition (children, render props) instead of conditional logic for variations.

## Violation Example

```jsx
const Button = ({ text, variant }) => {
  return <button className={`btn-${variant}`}>{text}</button>;
};

// Violation: Requires modifying Button to add icons
<Button text='Submit' variant='primary' />;
```

## Adherence Example

```jsx
const Button = ({ children, className }) => {
  return <button className={className}>{children}</button>;
};

// Extended via composition
<Button className='btn-primary'>
  <Icon name='check' /> Submit
</Button>;
```

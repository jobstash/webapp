# Liskov Substitution Principle in React

**Statement:** Subcomponents should be substitutable for their parent components.

**Rule:** Maintain consistent prop interfaces across component hierarchies.

## Violation Example

```jsx
// Breaks if substituted for base Modal
const ConfirmationModal = ({ onConfirm }) => {
  return (
    <Modal>
      <button onClick={onConfirm}>Confirm</button>
      <button
        onClick={() => {
          /* Force closes parent modal */
        }}
      >
        Cancel
      </button>
    </Modal>
  );
};
```

## Adherence Example

```jsx
// Can replace any Modal usage
const ConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    <Modal onClose={onClose}>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};
```

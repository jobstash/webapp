# Interface Segregation Principle in React

**Statement:** Components shouldn't depend on props they don't use.

**Rule:** Split "fat interfaces" into multiple smaller props or use component specialization.

## Violation Example

```jsx
const UserProfile = ({ user, onLogin, onLogout }) => {
  // Uses only `user`, but forced to accept auth handlers
  return <div>{user.name}</div>;
};
```

## Adherence Example

```jsx
const UserProfile = ({ user }) => {
  return <div>{user.name}</div>;
};

// Auth logic handled higher up
<UserProfile user={currentUser} />;
```

---
name: react-solid-principles
description: Use when creating components, refactoring components, or reviewing component architecture - covers SRP, OCP, LSP, ISP applied to React
---

# SOLID Principles in React

## Single Responsibility Principle (SRP)

**Statement:** A component should have only one reason to change.

**Rule:** Split react components into:

- **Utility functions:** functions that only do one thing
- **Reusable hooks:** hooks that perform only one task
- **Presentational components:** only task is to render based on props
- **Container components:** use hooks to send props to presentational components (suffix with `Container`)

### Violation

```tsx
// Manages user state, user fetch, date logic and user-list mapping
const ActiveUsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetch('/some-api');
      const data = await response.json();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return (
    <ul>
      {users
        .filter((user) => !user.isBanned && user.lastActivityAt >= weekAgo)
        .map((user) => (
          <li key={user.id}>
            <img src={user.avatarUrl} />
            <p>{user.fullName}</p>
          </li>
        ))}
    </ul>
  );
};
```

### Adherence

```tsx
// Utility: get-only-active.ts
const getOnlyActive = (users) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return users.filter(
    (user) => !user.isBanned && user.lastActivityAt >= weekAgo,
  );
};

// Hook: use-active-users.ts
const useActiveUsers = () => {
  const { users } = useUsers();
  const activeUsers = useMemo(() => getOnlyActive(users), [users]);
  return { activeUsers };
};

// Presentational: user-item.tsx
const UserItem = ({ user }) => (
  <li>
    <img src={user.avatarUrl} />
    <p>{user.fullName}</p>
  </li>
);

// Container: active-user-list.tsx
const ActiveUsersList = () => {
  const { activeUsers } = useActiveUsers();
  return (
    <ul>
      {activeUsers.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
```

### Extraction Threshold

Once a component contains `useState` or `useEffect`, ALL non-UI logic must be extracted:

- State → Hook
- Effects → Hook
- Handlers with side effects → Hook
- Data transformations → Hook or utility function

---

## Open-Closed Principle (OCP)

**Statement:** Components should be open for extension but closed for modification.

**Rule:** Use component composition (children, render props) instead of conditional logic for variations.

### Violation

```tsx
const Button = ({ text, variant }) => {
  return <button className={`btn-${variant}`}>{text}</button>;
};

// Requires modifying Button to add icons
<Button text='Submit' variant='primary' />;
```

### Adherence

```tsx
const Button = ({ children, className }) => {
  return <button className={className}>{children}</button>;
};

// Extended via composition
<Button className='btn-primary'>
  <Icon name='check' /> Submit
</Button>;
```

---

## Liskov Substitution Principle (LSP)

**Statement:** Subcomponents should be substitutable for their parent components.

**Rule:** Maintain consistent prop interfaces across component hierarchies.

### Violation

```tsx
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

### Adherence

```tsx
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

---

## Interface Segregation Principle (ISP)

**Statement:** Components shouldn't depend on props they don't use.

**Rule:** Split "fat interfaces" into multiple smaller props or use component specialization.

### Violation

```tsx
const UserProfile = ({ user, onLogin, onLogout }) => {
  // Uses only `user`, but forced to accept auth handlers
  return <div>{user.name}</div>;
};
```

### Adherence

```tsx
const UserProfile = ({ user }) => {
  return <div>{user.name}</div>;
};

// Auth logic handled higher up
<UserProfile user={currentUser} />;
```

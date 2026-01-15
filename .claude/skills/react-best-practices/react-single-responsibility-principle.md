# Single Responsibility Principle in React

**Statement:** A component should have only one reason to change.

**Rule:** Split react components into:

- **Utility functions:** functions that only do one thing
- **Reusable hooks:** hooks that perform only one task
- **Presentational components:** only task is to render based on props
- **Container components:** use hooks to send props to presentational components (suffix with `Container`)

## Violation Example

```jsx
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
            <small>{user.role}</small>
          </li>
        ))}
    </ul>
  );
};
```

## Adherence Example

**Utility function:** `get-only-active.ts` - date logic

```jsx
const getOnlyActive = (users) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return users.filter(
    (user) => !user.isBanned && user.lastActivityAt >= weekAgo,
  );
};
```

**Reusable hook:** `use-users.ts` - fetches user from api

```jsx
const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetch('/some-api');
      const data = await response.json();
      setUsers(data);
    };

    loadUsers();
  }, []);

  return { users };
};
```

**Reusable hook:** `use-active-users.ts` - applies date logic to fetched users

```jsx
const useActiveUsers = () => {
  const { users } = useUsers();

  const activeUsers = useMemo(() => {
    return getOnlyActive(users);
  }, [users]);

  return { activeUsers };
};
```

**Presentational component:** `user-item.tsx` - renders user item

```jsx
const UserItem = ({ user }) => {
  return (
    <li>
      <img src={user.avatarUrl} />
      <p>{user.fullName}</p>
      <small>{user.role}</small>
    </li>
  );
};
```

**Container component:** `active-user-list.tsx` - utilize hook and presentational component

```jsx
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

## Extraction Threshold

Once a component contains state management (`useState`) or side effects (`useEffect`), ALL non-UI logic must be extracted:

- State → Hook
- Effects → Hook
- Handlers with side effects → Hook
- Data transformations → Hook or utility function

The component keeps only:

- Hook calls
- Simple derived values from hook returns
- JSX rendering

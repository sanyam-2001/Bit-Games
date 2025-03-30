# Navigator Utility

A utility for navigating between pages without disconnecting the socket connection.

## Problem Solved

In applications using WebSockets, navigating between pages using the standard React Router navigation would cause the socket connections to disconnect and reconnect. This can lead to:

- Lost socket connection state
- Extra server load due to reconnections
- Poor user experience with interruptions in real-time updates

## Solution

The Navigator utility provides a wrapper around React Router's navigation functionality that maintains the socket connection while changing pages.

## Usage

### Basic Navigation

```jsx
import { useNavigator } from '../utils/navigator';

function MyComponent() {
  const navigate = useNavigator();
  
  const handleButtonClick = () => {
    // Navigate to another page without disconnecting socket
    navigate('/some-page');
  };
  
  return <button onClick={handleButtonClick}>Go to Page</button>;
}
```

### Navigation with Parameters

```jsx
import { useNavigator, createUrl } from '../utils/navigator';

function MyComponent() {
  const navigate = useNavigator();
  
  const goToLobby = (lobbyId) => {
    const url = createUrl('/lobby/:id', { id: lobbyId });
    navigate(url);
  };
  
  return <button onClick={() => goToLobby('123')}>Join Lobby 123</button>;
}
```

### Navigation with Query Parameters

```jsx
import { useNavigator, createUrl } from '../utils/navigator';

function MyComponent() {
  const navigate = useNavigator();
  
  const goToLobby = (lobbyId, username) => {
    const url = createUrl('/lobby/:id', { id: lobbyId }, { username });
    navigate(url);
  };
  
  return <button onClick={() => goToLobby('123', 'player1')}>
    Join as Player 1
  </button>;
}
```

### Navigation Options

```jsx
import { useNavigator } from '../utils/navigator';

function MyComponent() {
  const navigate = useNavigator();
  
  const replaceCurrentPage = () => {
    // Replace current entry in history stack
    navigate('/new-page', { replace: true });
  };
  
  const navigateWithState = () => {
    // Pass state to the target page
    navigate('/new-page', { state: { from: 'home', userData: { id: 123 } } });
  };
  
  return (
    <>
      <button onClick={replaceCurrentPage}>Replace Current Page</button>
      <button onClick={navigateWithState}>Navigate with State</button>
    </>
  );
}
```

## API Reference

### useNavigator()

Custom hook that returns a navigation function that won't disconnect the socket.

**Returns:** 
- `navigate(location, options)` - Function to navigate to a path

**Parameters for navigate function:**
- `location` (string): The path to navigate to
- `options` (object, optional): 
  - `replace` (boolean): Replace the current history entry instead of pushing a new one
  - `state` (object): State to pass to the target page
  - `preserveQuery` (boolean): Whether to preserve current query parameters

### createUrl(path, params, query)

Helper function to create URLs with path and query parameters.

**Parameters:**
- `path` (string): Base path with optional placeholders (e.g. '/lobby/:id')
- `params` (object, optional): Path parameters to replace placeholders
- `query` (object, optional): Query parameters to append

**Returns:**
- Formatted URL string

## Example

See the `NavigationExample.js` component for a complete example of how to use the navigator utility in a component. 
import * as React from 'react';
import './style.css';

export default function App() {
  const [userList, setUserList] = React.useState([]),
    [name, setName] = React.useState(''),
    [email, setEmail] = React.useState(''),
    [nextId, setNextId] = React.useState(0),
    [showLoading, setShowLoading] = React.useState(true),
    [showError, setShowError] = React.useState(false);

  function removeUser(cmp) {
    let tempUsers = userList || [];
    let btnId = cmp.target.id.replace(/\D/g, '');

    setUserList((current) =>
      current.filter((user) => {
        return user.key != btnId;
      })
    );
  }

  function addUser(event) {
    event.preventDefault();

    let tempUsers = [...userList];

    if (!!tempUsers) {
      tempUsers.push(
        <tr key={nextId}>
          <td>{name}</td>
          <td>{email}</td>
          <td>
            <button id={`button${nextId}`} onClick={removeUser}>
              Remove User
            </button>
          </td>
        </tr>
      );
      setUserList(tempUsers);
      setNextId(nextId + 1);
    }
  }

  function fetchUsers() {
    let users;
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((resData) => {
        users = resData.map(function (user) {
          return (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button id={`button${user.id}`} onClick={removeUser}>
                  Remove User
                </button>
              </td>
            </tr>
          );
        });
        setUserList(users);
        setNextId(users.length + 1);
        setShowLoading(false);
      })
      .catch((err) => {
        setShowLoading(false);
        setShowError(true);
        console.error('Error fetching data from url');
      });
  }

  function isValid() {
    if (name) return true;
  }

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users and Emails</h1>
      {showError ? (
        <p>ERROR: Unable to load user data</p>
      ) : (
        <div>
          {showLoading ? (
            <div>
              <h3>Loading table.....</h3>
            </div>
          ) : (
            <div>
              <table>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                  {userList}
                </tbody>
              </table>
            </div>
          )}

          <h3>Add User</h3>
          <form onSubmit={addUser}>
            <label>Name: </label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label>Email: </label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input type="submit" value="Add User" />
          </form>
        </div>
      )}
    </div>
  );
}

import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button';
import { LogOut } from 'react-feather';
import { Auth } from 'aws-amplify'
import { useHistory } from 'react-router-dom'

function NavBar(props) {
  const history = useHistory()

  const logout = () => {
    Auth.signOut().then((res) => {
      localStorage.clear()
      history.push('/login')
    })
  }
  return (
    <Nav className="m-3 align-items-center">
      <Nav.Item>
        <h1>Rewards</h1>
      </Nav.Item>
      <Nav.Item className="ms-auto">
        <Button variant="outline" onClick={logout}>

          <LogOut size={16} className="me-2" />
          Logout
        </Button>
      </Nav.Item>
    </Nav>
  )
}

export default NavBar
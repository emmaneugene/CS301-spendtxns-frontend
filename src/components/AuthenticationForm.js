import { useState,useEffect } from "react";
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Toast from "react-bootstrap/Toast"
import NewPasswordModal from "./NewPasswordModal";
import { useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify';
import { CHALLENGE_NAME } from '../utils/constants';


function AuthenticationForm({authed,setAuthed}) {
  const [user, setUser] = useState()
  const [form, setForm] = useState({})
  const [toastShow, setToastShow] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [toastText, setToastText] = useState()

  const history = useHistory()

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setAuthed(true)
        history.push(user ? '/' : '/login')
      })
      .catch(err => { setAuthed(false); console.log(err) })
  },[])

  const passwordValidator = require('password-validator');
  const pwValidator = new passwordValidator();

  pwValidator.is().min(8).has().uppercase().has().lowercase().has().digits().has().symbols();
  const setFormField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
  }
  function pageHandleAuth(e) {
    e.preventDefault()
    Auth.signIn(form.email, form.password)
      .then(user => {
        setUser(user)
        if (user.challengeName === CHALLENGE_NAME.NEW_PASSWORD_REQUIRED) {
          setModalShow(true)
        } else {
          setAuthed(true)
          redirect()
        }
      }).catch(err => {
        console.log(err)
        setToastText(err.message)
        setToastShow(true)
      })
  }

  function redirect() {
    history.push('/')
  }
  return (
    <div className="auth-form">
      <h1 className="title">View your <span className="text-primary">Points</span></h1>
      <h4 className="mb-4">Login</h4>
      <Form onSubmit={pageHandleAuth}>
        <Form.Group >
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={e => setFormField('email', e.target.value)} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={e => setFormField('password', e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-1">
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form.Group>
      </Form>
      <Toast onClose={() => setToastShow(false)} show={toastShow} delay={3000} autohide>
        <Toast.Body>{toastText}</Toast.Body>
      </Toast>
      <NewPasswordModal
        user={user}
        email={form.email}
        pwValidator={pwValidator}
        modalShow={modalShow}
        setModalShow={setModalShow}
        setToastShow={setToastShow}
        setToastText={setToastText}
        redirect={redirect}
      />
    </div>

  )
}

export default AuthenticationForm
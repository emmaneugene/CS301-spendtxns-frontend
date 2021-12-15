import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

import { Auth } from 'aws-amplify';


export default function NewPasswordModal({ user, email, modalShow, setModalShow, pwValidator, redirect }) {
  const [form, setForm] = useState({});
  const [errorText, setErrorText] = useState()
  const [errorShow, setErrorShow] = useState(false)
  const setFormField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (form.pw !== form.cfmPw) {
      setErrorText('Password does not match')
      setErrorShow(true)
    }
    else if (!pwValidator.validate(form.pw)) {
      setErrorText('Password must contain 8 characters with a minimum of 1 lower case letter, upper case letter, numeric character, special character')
      setErrorShow(true)
    } else {
      Auth.completeNewPassword(user, form.pw).then(user => {
        setModalShow(false)
        setErrorShow(false)
        redirect()
      })
    }
  }
  return (
    <Modal
      show={modalShow}
      onHide={(e) => setModalShow(false)}>
      <Modal.Body>
        <div className="text-center">
          <h3>Welcome!</h3>
          <p>Set a new password for {email}</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <p className={`danger text-center ${errorShow ? 'd-block' : 'd-none'}`}>{errorText}</p>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setFormField("pw", e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setFormField("cfmPw", e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Confirm
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

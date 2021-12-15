import Container from "react-bootstrap/Container"
import  Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import AuthenticationForm from "../components/AuthenticationForm";
function Authentication({authed, setAuthed}) {
  return (
    <Container fluid className="auth-page">
      <Row className="align-items-center">
        <Col lg={5} className="auth-form-container">
          <AuthenticationForm setAuthed={setAuthed}/>
        </Col>
        <Col lg={{span:3,offset:4}} className="side-img d-flex d-md-none d-lg-block">
        </Col>
      </Row>
    </Container>
  )
}

export default Authentication
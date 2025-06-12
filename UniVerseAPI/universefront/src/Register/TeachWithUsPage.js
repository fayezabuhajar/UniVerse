import  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, FormControl, Button, Modal } from 'react-bootstrap';
import axios from "axios";


const TeachWithUsPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');

  const handleGetStarted = () => {
    setError('');
    setEmail('');
    setPassword('');
    setShowModal(true); // فتح نافذة إدخال الإيميل
  };

  

      const handleBecomeInstructor = async () => {
      if (!password) return;
      setLoading(true);

      try {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
          alert("You must be logged in as a student first.");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "https://localhost:5001/api/InstructorAccount/convert-to-instructor",
          { password }, // فقط كلمة المرور
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ التعامل مع النتيجة
        const result = response.data;
        localStorage.setItem('token', result.token);
        window.location.href = '/InstructorCourses';
        alert("Congratulations! You are now an instructor.");
        setShowModal(false);
        setShowConfirmModal(false);
      } catch (error) {
        if (error.response) {
          // 🔍 الخطأ من السيرفر: 400 أو 401 أو 500
          alert(error.response.data || "Failed to convert to instructor.");
        } else {
          // 🛑 خطأ غير متوقع
          alert("Something went wrong, please try again.");
        }
        console.error("Error converting to instructor:", error);
      }

      setLoading(false);
    };



  return (
    <>
      <Navbar expand="lg" bg="light" className="shadow-sm px-4 py-3 sticky-top">
        <Navbar.Brand href="#" className="fw-bold text-dark">UniVerse</Navbar.Brand>
        <Form className="d-flex mx-4 flex-grow-1">
          <FormControl
            type="search"
            placeholder="Search for anything"
            className="me-2 rounded-pill"
          />
        </Form>
        <Nav>
          <Nav.Link href="#" className="text-dark">Explore</Nav.Link>
          <Nav.Link href="#" className="text-dark">UniVerse Business</Nav.Link>
          <Nav.Link href="/TeachWithUsPage" className="text-dark">Teach on UniVerse</Nav.Link>
        </Nav>
      </Navbar>

      <div className="container-fluid bg-light py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 text-center text-lg-start px-5">
            <h2 className="fw-bold display-4 mb-3">Come<br />Teach With<br />Us</h2>
            <Button className="btn btn-primary btn-lg px-4" onClick={handleGetStarted}>
              Get started
            </Button>
            <div className="mt-3">
              <span>Already have an instructor account? </span>
              <a href="/InstructorLogin" className="text-primary fw-bold">Log in</a>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src="https://cvc.edu/wp-content/uploads/revslider/home-slides1/woman-laptop.png"
              alt="Instructor"
              className="img-fluid rounded"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>

        {/* Modal: إدخال كلمة المرور فقط */} 
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Become an Instructor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Create a password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {error && <div className="text-danger mt-2">{error}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleBecomeInstructor}
              disabled={loading || !password}
            >
              {loading ? "Processing..." : "Continue"}
            </Button>
          </Modal.Footer>
        </Modal>


        {/* Modal: تأكيد التحويل إلى مدرب */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Instructor Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to become an instructor?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleBecomeInstructor} disabled={loading}>
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* باقي الصفحة */}
        <div className="text-center mt-5">
          <h2 className="fw-bold mb-4">So many reasons to start</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <img src="https://s.udemycdn.com/teaching/value-prop-teach-2x-v3.jpg" alt="Teach your way" height="50" className="mb-3" />
              <h5>Teach your way</h5>
              <p>Publish the course you want, in the way you want, and always have control of your own content.</p>
            </div>
            <div className="col-md-4 mb-4">
              <img src="https://s.udemycdn.com/teaching/value-prop-inspire-2x-v3.jpg" alt="Inspire learners" height="50" className="mb-3" />
              <h5>Inspire learners</h5>
              <p>Teach what you know and help learners explore their interests, gain new skills, and advance their careers.</p>
            </div>
            <div className="col-md-4 mb-4">
              <img src="https://s.udemycdn.com/teaching/value-prop-get-rewarded-2x-v3.jpg" alt="Get rewarded" height="50" className="mb-3" />
              <h5>Get rewarded</h5>
              <p>Expand your professional network, build your expertise, and earn money on each paid enrollment.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachWithUsPage;

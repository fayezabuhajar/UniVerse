import  { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios'; // تأكد من استيراد axios
import './StudentRegister.css';

const StudentRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  // const [bio, setBio] = useState('');
  const [university, setUniversity] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // التحقق من أن جميع الحقول قد تم ملؤها
    if (!firstName || !lastName || !userName || !email || !password || !confirmPassword || !gender || !university || !specialization) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    // التحقق من تطابق كلمات المرور
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // بيانات التسجيل
    const registerData = {
      firstName,
      lastName,
      userName,
      email,
      password,
      dateOfBirth,
      gender,
      // bio,
      university,
      specialization
    };

    try {
      // إرسال البيانات إلى الـ API باستخدام axios
      const response = await axios.post('http://localhost:5000/api/studentaccount/register', registerData);
      console.log('User Registered:', response.data);
      alert(`Registered successfully! Welcome ${response.data.firstName}`);
      window.location.href = '/login';
    } catch (error) {
      console.error('Registration Error:', error);
      setErrorMessage('There was an error with registration. Please try again.');
    }
  };

  return (
    <Container fluid className="register-page">
      <Row className="min-vh-100 align-items-center">
        {/* صورة جانبية */}
        <Col md={6} className="d-none d-md-flex justify-content-center">
          <img src="https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-online-learning-concept-png-image_11911519.png" alt="Register Illustration" className="img-fluid w-75" />
        </Col>

        {/* نموذج التسجيل */}
        <Col md={6} className="p-4">
          <div className="register-form-box mx-auto">
            <h2 className="fw-bold mb-4">Create an Account</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <Form onSubmit={handleRegister}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>University</Form.Label>
                <Form.Control
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              </Form.Group>

             {/* <Form.Group className="mb-4">
                <Form.Label>Bio (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Form.Group> 
              */}

              <Button variant="primary" type="submit" className="w-100" size="lg">
                Register
              </Button>
            </Form>

            <p className="text-center mt-4">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentRegister;

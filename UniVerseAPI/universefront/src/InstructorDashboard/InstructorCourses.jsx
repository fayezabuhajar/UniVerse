import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import {  FaComments, FaQuestionCircle, FaChevronDown, FaEnvelope, FaTasks, FaClipboardList } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


const InstructorCourses = () => {
   const [showSubMenu, setShowSubMenu] = useState(false);

   const handleShowCreateModal = () => setShowCreateModal(true);
   const handleShowEditModal = () => setShowEditModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   

const getInstructorIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);

    // حسب اسم الـ claim اللي حطيت في التوكن:
    const instructorId = decoded.Id || decoded.id || decoded.instructorId;
    return instructorId || null;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

const fetchCourses = async (instructorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`https://localhost:5001/api/course/instructor/${instructorId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
     console.log("Fetched data:", response.data);
    setCourses(response.data);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
  }
};



  useEffect(() => {
  const instructorId = getInstructorIdFromToken();
  if (instructorId) {
    setFormData(prev => ({
      ...prev,
      instructorId
    }));
    fetchCourses(instructorId); // Fetch courses for the instructor
  }
}, []);

    const [courses, setCourses] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      price: '',
      duration: '',
      pictureUrl: '',
      videoPreviewUrl: '',

    });
  
    
  
    const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form Submitted!");
  
  if (!formData.title || !formData.description || !formData.price) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch('https://localhost:5001/api/course/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
      
    });
    console.log('Sending course data:', formData);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Something went wrong');
    }

    const result = await response.json();
    console.log('Course created:', result);

    setFormData({ title: '', description: '', price: '', duration: '', pictureUrl: '', videoPreviewUrl: '', instructorId: formData.instructorId });
    handleCloseCreateModal();
    alert('Course created successfully!');

    // ✅ اجلب الكورسات مرة أخرى بعد إنشاء الكورس
    fetchCourses(formData.instructorId);
  } catch (error) {
    console.error('Error creating course:', error.message);
    alert(`Failed to create course: ${error.message}`);
  }
};
    

  


const handleEdit = (course) => {
  if (!window.confirm('Are you sure you want to edit this course?')) return;

  // ✅ Load course into the form before editing
  setFormData(course);
  setShowEditModal(true);
};

const handleSave = async () => {
  try {
    await fetch(`https://localhost:5001/api/course/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Optionally update the course list without reloading
    setCourses(prev =>
      prev.map(c => (c.id === formData.id ? formData : c))
    );

    setShowEditModal(false);
  } catch (error) {
    console.error('Failed to update course:', error);
  }
};



  


  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await fetch(`https://localhost:5001/api/course/${courseId}`, { method: 'DELETE' });
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

    
  return (
    
    <div className="d-flex">
      {/* Sidebar */}
          <div className="bg-dark text-white vh-400 p-3" style={{ width: '430px' }}>
      <h4 className="text-white mb-4">UniVerse</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <a href="/InstructorCourses" className="nav-link text-white">
            <i className="bi bi-book me-2"></i>Courses
          </a>
        </li>
        <li className="nav-item mb-2">
          <span
            className="nav-link text-white d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowSubMenu(!showSubMenu)}
          > 
            <span>
              <FaComments className="me-2" />Communication
            </span>
            <FaChevronDown />
          </span>

          {showSubMenu && (
            <ul className="nav flex-column ms-3 mt-2">
              <li className="nav-item mb-1">
                <a href="/Comments" className="nav-link text-white">
                  <FaQuestionCircle className="me-2" /> Comments
                </a>
              </li>
              <li className="nav-item mb-1">
                <a href="/messages" className="nav-link text-white">
                  <FaEnvelope className="me-2" /> Messages
                </a>
              </li>
              <li className="nav-item mb-1">
                <a href="/assignments" className="nav-link text-white">
                  <FaTasks className="me-2" /> Assignments
                </a>
              </li>
              <li className="nav-item mb-1">
                <a href="/quizzes" className="nav-link text-white">
                  <FaClipboardList className="me-2" /> Quizzes
                </a>
              </li>
            </ul>
          )}
        </li>
            
          
       
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <i className="bi bi-bar-chart-line me-2"></i>Performance
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <i className="bi bi-tools me-2"></i>Tools
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <i className="bi bi-folder2-open me-2"></i>Resources
          </a>
        </li>
      </ul>
    </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Jump Into Course Creation</h5>
          <button className="btn btn-primary" onClick={handleShowCreateModal}>Create Your Course</button>
        </div>

         <div className="list-group mb-4">
          {courses.length === 0 && <p>No courses found.</p>}
          {courses.map(course => (
            <div key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h6>{course.title}</h6>
                <p>{course.description}</p>
                <small>Price: {course.price} JD | Duration: {course.duration} hours</small>
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(course)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(course.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>


        

         {/* Create Modal */}
         <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title"  onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duration (hours)</Form.Label>
                <Form.Control type="text" name="duration" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Picture URL</Form.Label>
                <Form.Control type="text" name="pictureUrl" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Video Preview URL</Form.Label>
                <Form.Control type="text" name="videoPreviewUrl" onChange={handleChange} />
              </Form.Group>
              <Button type="submit" variant="primary">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal>


        {/*edit Modal */}
         <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duration (hours)</Form.Label>
                <Form.Control type="text" name="duration" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Picture URL</Form.Label>
                <Form.Control type="text" name="pictureUrl" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Video Preview URL</Form.Label>
                <Form.Control type="text" name="videoPreviewUrl" onChange={handleChange} />
              </Form.Group>
              <Button type="submit" variant="primary">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal>

        <p className="text-muted">Based on your experience, we think these resources will be helpful.</p>

        <div className="row">

            
          

          <div className="col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  {/* صورة في النصف الأيسر */}
                  <div className="col-md-6 text-center">
                    <img
                      src="https://s.udemycdn.com/instructor/dashboard/engaging-course.jpg"
                      alt=""
                      className="img-fluid"
                      style={{ maxHeight: '200px',
                        maxWidth: '200px'
                       }}
                    />
                  </div>
                  
                  {/* النص في النصف الأيمن */}
                  <div className="col-md-6">
                    <h5 className="card-title">Create an Engaging Course</h5>
                    <p className="card-text">
                    Whether you've been teaching for years or are teaching for the first time, you can make an engaging course...
                    </p>
                    <a href="#" className="text-primary">Get Started</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  {/* صورة في النصف الأيسر */}
                  <div className="col-md-6 text-center">
                    <img
                      src="https://s.udemycdn.com/instructor/dashboard/video-creation.jpg"
                      alt=""
                      className="img-fluid"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                  
                  {/* النص في النصف الأيمن */}
                  <div className="col-md-6">
                    <h5 className="card-title">Get Started with Video</h5>
                    <p className="card-text">
                      Quality video lectures can set your course apart. Use our resources to learn the basics.
                    </p>
                    <a href="#" className="text-primary">Get Started</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  {/* صورة في النصف الأيسر */}
                  <div className="col-md-6 text-center">
                    <img
                      src="https://s.udemycdn.com/instructor/dashboard/build-audience.jpg"
                      alt=""
                      className="img-fluid"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                  
                  {/* النص في النصف الأيمن */}
                  <div className="col-md-6">
                    <h5 className="card-title">Build Your Audience</h5>
                    <p className="card-text">
                    Set your course up for success by building your audience.
                    </p>
                    <a href="#" className="text-primary">Get Started</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default InstructorCourses;

import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Form, Button } from "react-bootstrap";

const CourseFilters = () => {
  const [coursesData, setCoursesData] = useState([]);

  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Helper to extract unique values
  const getUniqueValues = (array, key) => [...new Set(array.map(item => item[key]))];

  // Fetch all courses
  useEffect(() => {
    axios.get("/api/courses")
      .then(res => {
        const allCourses = res.data;
        setCoursesData(allCourses);
        setUniversities(getUniqueValues(allCourses, 'university'));
      })
      .catch(err => console.error("Error fetching courses", err));
  }, []);

  // Update colleges when university changes
  useEffect(() => {
    const filtered = coursesData.filter(c => c.university === university);
    setColleges(getUniqueValues(filtered, 'college'));
    setCollege('');
    setSpecialization('');
    setSelectedCourseId('');
  }, [university]);

  // Update specializations when college changes
  useEffect(() => {
    const filtered = coursesData.filter(
      c => c.university === university && c.college === college
    );
    setSpecializations(getUniqueValues(filtered, 'specialization'));
    setSpecialization('');
    setSelectedCourseId('');
  }, [college]);

  // Update course list when specialization changes
  useEffect(() => {
    const filtered = coursesData.filter(
      c =>
        c.university === university &&
        c.college === college &&
        c.specialization === specialization
    );
    setFilteredCourses(filtered);
    setSelectedCourseId('');
  }, [specialization]);

  return (
    <Row className="bg-white p-4 rounded shadow-sm">
      <Col md={3}>
        <Form.Select
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        >
          <option value="">Select university</option>
          {universities.map((u, i) => (
            <option key={i} value={u}>{u}</option>
          ))}
        </Form.Select>
      </Col>

      <Col md={3}>
        <Form.Select
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          disabled={!university}
        >
          <option value="">Select college</option>
          {colleges.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </Form.Select>
      </Col>

      <Col md={3}>
        <Form.Select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          disabled={!college}
        >
          <option value="">Select specialization</option>
          {specializations.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </Form.Select>
      </Col>

      <Col md={3}>
        <Form.Select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          disabled={!specialization}
        >
          <option value="">Select course</option>
          {filteredCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (Course ID: {c.id})
            </option>
          ))}
        </Form.Select>
      </Col>

      <Col md={12} className="mt-4 text-center">
        <Button
          variant="primary"
          className="btn-purple px-4 py-2"
          style={{ width: "200px" }}
          onClick={() => {
            const course = filteredCourses.find(c => c.id === parseInt(selectedCourseId));
            alert(
              `You selected:\n\nUniversity: ${university}\nCollege: ${college}\nSpecialization: ${specialization}\nCourse: ${course?.name || 'N/A'}`
            );
          }}
          disabled={!selectedCourseId}
        >
          Search Courses
        </Button>
      </Col>
    </Row>
  );
};

export default CourseFilters;

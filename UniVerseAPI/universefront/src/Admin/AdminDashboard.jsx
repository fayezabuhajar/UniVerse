import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const token = JSON.parse(localStorage.getItem("adminToken"))?.token;


  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

const fetchAllData = async () => {
  try {
    // Fetch approved courses
    const approvedRes = await axios.get("https://localhost:5001/api/course/approved", config);
    setCourses(approvedRes.data);
    console.log("Approved courses fetched successfully");

    // Fetch pending courses
    const pendingRes = await axios.get("https://localhost:5001/api/course/pending", config);
    setPendingCourses(pendingRes.data);
    console.log("Pending courses fetched successfully");

    // Fetch students
    const studentsRes = await axios.get("https://localhost:5001/api/student", config);
    setStudents(studentsRes.data);
    console.log("Students fetched successfully");

    // Fetch instructors
    const instructorsRes = await axios.get("https://localhost:5001/api/instructor", config);
    setInstructors(instructorsRes.data);
    console.log("Instructors fetched successfully");

  } catch (err) {
    console.error("Error fetching data:");
    if (err.response) {
      console.error("Failed URL:", err.config.url);
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else if (err.request) {
      console.error("No response received for:", err.config?.url);
    } else {
      console.error("Error Message:", err.message);
    }
  }
};




  useEffect(() => {
    fetchAllData();
  }, []);



  const deleteCourse = async (id) => {
    try {
      await axios.delete(`/api/course/${id}`, config);
      fetchAllData();
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const blockInstructor = async (instructorId) => {

  try {
    await axios.put(
      `https://localhost:5001/api/instructor/block/${instructorId}`,
      {}, // body فارغة
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Instructor blocked successfully");
    fetchAllData();
    // هنا ممكن تعيد جلب البيانات لتحديث الواجهة
  } catch (error) {
    console.error("Error blocking instructor:", error);
    alert("Failed to block instructor");
  }
};

const blockStudent = async (studentId) => {

  try {
    await axios.put(
      `https://localhost:5001/api/student/block/${studentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Student blocked successfully");
    fetchAllData();
  } catch (error) {
    console.error("Error blocking student:", error);
    alert("Failed to block student");
  }
};

const unblockStudent = async (id) => {
  try {
    await axios.put(`https://localhost:5001/api/student/unblock/${id}`, {}, config);
    alert("Student unblocked successfully");
    fetchAllData();
  } catch (err) {
    console.error("Error unblocking student:", err);
  }
};

const unblockInstructor = async (id) => {
  try {
    await axios.put(`https://localhost:5001/api/instructor/unblock/${id}`, {}, config);
    alert("Instructor unblocked successfully");
    fetchAllData();
  } catch (err) {
    console.error("Error unblocking instructor:", err);
  }
};

    const handleApprove = async (courseId) => {
  try {
    await axios.post(
      `https://localhost:5001/api/course/approve/${courseId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert('Course approved successfully');
    fetchAllData(); // Refresh data after status change
  } catch (error) {
    console.error('Error approving course:', error);
    alert('Failed to approve course');
  }
};

const handleReject = async (courseId) => {
  try {
    await axios.post(
      `https://localhost:5001/api/course/reject/${courseId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert('Course rejected successfully');
    fetchAllData(); // Refresh data after status change
  } catch (error) {
    console.error('Error rejecting course:', error);
    alert('Failed to reject course');
  }
};


  return (
    <div className="container my-4">
      <div className="row gx-4 gy-4">
        {/* Approved Courses */}
        <div className="col-12 col-md-6 col-lg-3">
          <h5>Approved Courses</h5>
          <ul className="list-group">
            {courses.map((c) => (
              <li
                key={c.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {c.title}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteCourse(c.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Pending Courses */}
        <div className="col-12 col-md-6 col-lg-3">
          <h5>Pending Courses</h5>
          <ul className="list-group">
            {pendingCourses.map((c) => (
              <li
                key={c.id}
                className="list-group-item d-flex flex-column"
              >
                <div className="d-flex justify-content-between">
                  <span>{c.title}</span>
                  <div>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleApprove(c.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleReject(c.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Students */}
<div className="col-12 col-md-6 col-lg-3">
  <h5>All Students</h5>
  <ul className="list-group">
    {students.map((s) => (
      <li
        key={s.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        {s.email}
        {s.isBlocked ? (
          <button
            className="btn btn-sm btn-success"
            onClick={() => unblockStudent(s.id)}
          >
            Unblock
          </button>
        ) : (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => blockStudent(s.id, "student")}
          >
            Block
          </button>
        )}
      </li>
    ))}
  </ul>
</div>

        {/* Instructors */}
<div className="col-12 col-md-6 col-lg-3">
  <h5>All Instructors</h5>
  <ul className="list-group">
    {instructors.map((i) => (
      <li
        key={i.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        {i.email}
        {i.isBlocked ? (
          <button
            className="btn btn-sm btn-success"
            onClick={() => unblockInstructor(i.id)}
          >
            Unblock
          </button>
        ) : (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => blockInstructor(i.id)}
          >
            Block
          </button>
        )}
      </li>
    ))}
  </ul>
</div>

      </div>
    </div>
  );
};

export default AdminDashboard;

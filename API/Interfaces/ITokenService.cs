using System;
using Core.Entities;


namespace API.Interfaces;

public interface ITokenService
{
    string CreateStudentToken(Student student);
    string CreateInstructorToken(Instructor instructor);
    string CreateAdminToken(Admin admin); 

}

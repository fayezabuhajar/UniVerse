using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;


namespace API.Controllers
{
   
    public class StudentController : BaseApiController
    {
        private readonly UniverseContext _context;

        public StudentController(UniverseContext context)
        {
            _context = context;
        }

        // Get All Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetAllStudents()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }

        // Create
        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent(RegisterDto registerDto)
        {
            if (await _context.Students.AnyAsync(x => x.Email == registerDto.Email.ToLower()))
            {
                return BadRequest("Email is taken");
            }

            using var hmac = new HMACSHA512();
            var student = new Student
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                UserName = registerDto.UserName.ToLower(),
                Email = registerDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
                DateOfBirth = registerDto.DateOfBirth,
                Gender = registerDto.Gender,
                Bio = registerDto.Bio,
                University = registerDto.University,
                Specialization = registerDto.Specialization
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }

        // GET api/student/by-email/{email}
[HttpGet("by-email")]
public async Task<ActionResult<Student>> GetStudentByEmail([FromQuery] string email)
{
    var student = await _context.Students.FirstOrDefaultAsync(s => s.Email.ToLower() == email.ToLower());

    if (student == null)
        return NotFound();

    return Ok(student);
}


        // Read
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, RegisterDto registerDto)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            student.FirstName = registerDto.FirstName;
            student.LastName = registerDto.LastName;
            student.UserName = registerDto.UserName.ToLower();
            student.Email = registerDto.Email;
            student.DateOfBirth = registerDto.DateOfBirth;
            student.Gender = registerDto.Gender;
            student.Bio = registerDto.Bio;
            student.University = registerDto.University;
            student.Specialization = registerDto.Specialization;

            await _context.SaveChangesAsync();

            return NoContent();
        }

    [HttpPut("block/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BlockStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return NotFound("Student not found");

        student.IsBlocked = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Student blocked successfully" });
    }

    [HttpPut("unblock/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UnblockStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return NotFound("Student not found");

        student.IsBlocked = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Student unblocked successfully" });
    }

        // Update Password
        [HttpPut("{id}/update-password")]
        public async Task<IActionResult> UpdatePassword(int id, UpdatePasswordDto updatePasswordDto)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null) return Unauthorized("Invalid Email");

            using var hmac = new HMACSHA512(student.PasswordSalt);
            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updatePasswordDto.OldPassword));

            for (int i = 0; i < computeHash.Length; i++)
            {
                if (computeHash[i] != student.PasswordHash[i]) return Unauthorized("Invalid Old Password");
            }

            student.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updatePasswordDto.NewPassword));
            student.PasswordSalt = hmac.Key;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

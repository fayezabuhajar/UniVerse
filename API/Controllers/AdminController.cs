using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using API.Interfaces;


namespace API.Controllers
{
    
    public class AdminController(UniverseContext _context, ITokenService _tokenService) : BaseApiController
    {
        

        // ✅ Register Admin
        [HttpPost("register")]
        public async Task<ActionResult> Register(AdminRegisterDto dto)
        {
            if (await _context.Admins.AnyAsync(a => a.Email == dto.Email))
                return BadRequest("Email is already taken");

            using var hmac = new HMACSHA512();
            var admin = new Admin
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok("Admin registered successfully");
        }

        // ✅ Login Admin
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(AdminLoginDto dto)
        {
            var admin = await _context.Admins.SingleOrDefaultAsync(a => a.Email == dto.Email);
            if (admin == null) return Unauthorized("Invalid credentials");

            using var hmac = new HMACSHA512(admin.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));

            if (!computedHash.SequenceEqual(admin.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = _tokenService.CreateAdminToken(admin);
            return Ok(new { token });
        }



        // ✅ Approve Course
        [HttpPut("approve/{courseId}")]
        public async Task<ActionResult> ApproveCourse(int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return NotFound("Course not found");

            course.Status = CourseStatus.Approved;
            course.IsPublished = true;
            await _context.SaveChangesAsync();

            return Ok("Course approved and published");
        }

        // ✅ Reject Course
        [HttpPut("reject/{courseId}")]
        public async Task<ActionResult> RejectCourse(int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return NotFound("Course not found");

            course.Status = CourseStatus.Rejected;
            course.IsPublished = false;
            await _context.SaveChangesAsync();

            return Ok("Course rejected");
        }
    }
}

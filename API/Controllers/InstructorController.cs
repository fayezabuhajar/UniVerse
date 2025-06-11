using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
  
    public class InstructorController : BaseApiController
    {
        private readonly UniverseContext _context;

        public InstructorController(UniverseContext context)
        {
            _context = context;
        }


       [Authorize]
        [HttpGet("get-instructor-id")]
public ActionResult<int> GetInstructorIdFromToken()
{
    var instructorIdClaim = User.FindFirst("Id")?.Value;

    if (string.IsNullOrEmpty(instructorIdClaim))
        return Unauthorized("Instructor ID not found in token.");

    if (!int.TryParse(instructorIdClaim, out int instructorId))
        return BadRequest("Invalid Instructor ID in token.");

    return Ok(instructorId);
}

    

        // Get All Instructors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Instructor>>> GetAllInstructors()
        {
            var instructors = await _context.Instructors.ToListAsync();
            return Ok(instructors);
        }

        // Create
        [HttpPost]
        public async Task<ActionResult<Instructor>> CreateInstructor(RegisterDto registerDto)
        {
            if (await _context.Instructors.AnyAsync(x => x.Email == registerDto.Email.ToLower()))
            {
                return BadRequest("Email is taken");
            }

            using var hmac = new HMACSHA512();
            var instructor = new Instructor
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

            _context.Instructors.Add(instructor);
            await _context.SaveChangesAsync();

            return Ok(instructor);
        }

        // Read
        [HttpGet("{id}")]
        public async Task<ActionResult<Instructor>> GetInstructor(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);

            if (instructor == null)
            {
                return NotFound();
            }

            return Ok(instructor);
        }

          [HttpPut("block/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BlockInstructor(int id)
    {
        var instructor = await _context.Instructors.FindAsync(id);
        if (instructor == null)
            return NotFound("Instructor not found");

        instructor.IsBlocked = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Instructor blocked successfully" });
    }

    // Unblock Instructor (اختياري)
    [HttpPut("unblock/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UnblockInstructor(int id)
    {
        var instructor = await _context.Instructors.FindAsync(id);
        if (instructor == null)
            return NotFound("Instructor not found");

        instructor.IsBlocked = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Instructor unblocked successfully" });
    }


        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInstructor(int id, RegisterDto registerDto)
        {
            var instructor = await _context.Instructors.FindAsync(id);

            if (instructor == null)
            {
                return NotFound();
            }

            using var hmac = new HMACSHA512(instructor.PasswordSalt);

            instructor.FirstName = registerDto.FirstName;
            instructor.LastName = registerDto.LastName;
            instructor.UserName = registerDto.UserName.ToLower();
            instructor.Email = registerDto.Email;
            instructor.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            instructor.DateOfBirth = registerDto.DateOfBirth;
            instructor.Gender = registerDto.Gender;
            instructor.Bio = registerDto.Bio;
            instructor.University = registerDto.University;
            instructor.Specialization = registerDto.Specialization;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        // Update Password
        [HttpPut("{id}/update-password")]
        public async Task<IActionResult> UpdatePassword(int id, UpdatePasswordDto updatePasswordDto)
        {
            var instructor = await _context.Instructors.FindAsync(id);

            if (instructor == null) return Unauthorized("Invalid Email");

            using var hmac = new HMACSHA512(instructor.PasswordSalt);
            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updatePasswordDto.OldPassword));

            for (int i = 0; i < computeHash.Length; i++)
            {
                if (computeHash[i] != instructor.PasswordHash[i]) return Unauthorized("Invalid Old Password");
            }

            instructor.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updatePasswordDto.NewPassword));
            instructor.PasswordSalt = hmac.Key;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInstructor(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);

            if (instructor == null)
            {
                return NotFound();
            }

            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

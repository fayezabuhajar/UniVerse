using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using API.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Controllers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Core.Entities;


public class InstructorAccountController(UniverseContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")] // InstructorAccount/Register
    public async Task<ActionResult<InstructorDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Email))
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

        context.Instructors.Add(instructor);
        await context.SaveChangesAsync();

        var token = tokenService.CreateInstructorToken(instructor);

        var instructorDto = new InstructorDto
        {
            FirstName = instructor.FirstName,
            LastName = instructor.LastName,
            UserName = instructor.UserName,
            Email = instructor.Email,
            Token = token,
            DateOfBirth = instructor.DateOfBirth,
            Gender = instructor.Gender,
            University = instructor.University,
            Specialization = instructor.Specialization
        };

        return Ok(instructorDto);
    }


    [Authorize(Roles = "Student")]
    [HttpPost("convert-to-instructor")]
    public async Task<ActionResult<InstructorDto>> ConvertStudentToInstructor([FromBody] InstructorPasswordDto dto)
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email))
            return Unauthorized("Email not found in token.");

        var newPassword = dto.Password;
        if (string.IsNullOrWhiteSpace(newPassword))
            return BadRequest("Password is required.");

        if (await context.Instructors.AnyAsync(i => i.Email == email))
            return BadRequest("User is already an instructor.");

        var student = await context.Students.FirstOrDefaultAsync(s => s.Email == email);
        if (student == null)
            return NotFound("Student not found.");

        using var hmac = new HMACSHA512();
        var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(newPassword));
        var passwordSalt = hmac.Key;

        var instructor = new Instructor
        {
            FirstName = student.FirstName,
            LastName = student.LastName,
            UserName = student.UserName,
            Email = student.Email,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            DateOfBirth = student.DateOfBirth,
            Gender = student.Gender,
            Bio = student.Bio,
            University = student.University,
            Specialization = student.Specialization
        };

        context.Instructors.Add(instructor);
        await context.SaveChangesAsync();

        var token = tokenService.CreateInstructorToken(instructor);

        return Ok(new InstructorDto
        {
            FirstName = instructor.FirstName,
            LastName = instructor.LastName,
            UserName = instructor.UserName,
            Email = instructor.Email,
            Token = token,
            DateOfBirth = instructor.DateOfBirth,
            Gender = instructor.Gender,
            University = instructor.University,
            Specialization = instructor.Specialization
        });
    }




    [HttpPost("login")] // InstructorAccount/Login
    public async Task<ActionResult<InstructorDto>> Login(LoginDto loginDto)
    {
        var instructor = await context.Instructors.FirstOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

        if (instructor == null) return Unauthorized("Invalid Email");

        using var hmac = new HMACSHA512(instructor.PasswordSalt);
        var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computeHash.Length; i++)
        {
            if (computeHash[i] != instructor.PasswordHash[i]) return Unauthorized("Invalid Password");
        }

        if (instructor.IsBlocked)
            {
                return Unauthorized("Your account has been blocked. Please contact support.");
            }
        else
        {
            return Ok(new InstructorDto
        {
            FirstName = instructor.FirstName,
            LastName = instructor.LastName,
            UserName = instructor.UserName,
            Email = instructor.Email,
            Token = tokenService.CreateInstructorToken(instructor),
            DateOfBirth = instructor.DateOfBirth,
            Gender = instructor.Gender,
            Specialization = instructor.Specialization,
            University = instructor.University
        });
        }
        
    }

    private async Task<bool> UserExists(string email)
    {
        return await context.Instructors.AnyAsync(x => x.Email.ToLower() == email.ToLower());
    }
}


using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using API.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core.Entities;
using API.Controllers;

public class StudentAccountController(UniverseContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")] // StudentAccount/Register
    public async Task<ActionResult<StudentDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Email))
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

        context.Students.Add(student);
        await context.SaveChangesAsync();

        var token = tokenService.CreateStudentToken(student);

        var studentDto = new StudentDto
        {
            Email = student.Email,
            Token = token
        };

        return Ok(studentDto);
    }

    [HttpPost("login")] // StudentAccount/Login
    public async Task<ActionResult<StudentDto>> Login(LoginDto loginDto)
    {
        var student = await context.Students.FirstOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

        if (student == null) return Unauthorized("Invalid Email");

        using var hmac = new HMACSHA512(student.PasswordSalt);
        var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computeHash.Length; i++)
        {
            if (computeHash[i] != student.PasswordHash[i]) return Unauthorized("Invalid Password");
        }

        if (student.IsBlocked)
            {
                return Unauthorized("Your account has been blocked. Please contact support.");
            }
        else
        {
            return Ok(new StudentDto
                {
                    Email = student.Email,
                    Token = tokenService.CreateStudentToken(student)
        }       );
        }
        
    }

    private async Task<bool> UserExists(string email)
    {
        return await context.Students.AnyAsync(x => x.Email.ToLower() == email.ToLower());
    }
}



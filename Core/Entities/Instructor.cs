using Core.Entities;

namespace Core.Entities
{
    /// <summary>
    /// Represents an instructor who teaches courses and has a personal and professional profile.
    /// </summary>
    public class Instructor : BaseEntity
    {
   
        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string UserName { get; set; }


        public required string Email { get; set; }


        public required byte[] PasswordHash { get; set; }


        public required byte[] PasswordSalt { get; set; }

        public DateOnly DateOfBirth { get; set; }

    
        public required string Gender { get; set; }

        public string? Bio { get; set; }


        public string? ProfileImageUrl { get; set; }

        public bool IsBlocked { get; set; } = false;

       
        public required string University { get; set; }

    
        public required string Specialization { get; set; }

        public string? SocialLinks { get; set; }


        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }
}

namespace Core.Entities
{
    public class Admin : BaseEntity
    {
        public required string Username { get; set; }

        public required string Email { get; set; }

        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }

        // يمكن إضافة خاصية لتحديد الصلاحيات لو احتجت
        public string? Role { get; set; } = "Admin";

     
    }
}
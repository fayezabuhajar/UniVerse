namespace Core.Entities
{
   
    public class Course : BaseEntity
    {

        public required string Title { get; set; }

        public required string Description { get; set; }

        public decimal Price { get; set; }

        public int Duration { get; set; }

        public int InstructorId { get; set; }

        public required string PictureUrl { get; set; }


        public required string VideoPreviewUrl { get; set; }
        
        public CourseStatus Status { get; set; } = CourseStatus.Pending;


        public bool IsPublished { get; set; }

       
        public int EnrollmentCount { get; set; }

  
        public float Rating { get; set; }

        public required string University { get; set; }
        public required string Specialization { get; set; }

 
        public Instructor? Instructor { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
public enum CourseStatus
{
    Pending,
    Approved,
    Rejected
}

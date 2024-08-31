using CO_P_library.Models;

namespace Co_P_WebAPI.DTO
{
    public class KindergartenYearDTO
    {
        public int CurrentAcademicYear { get; set; }
        public string KindergartenNumber { get; set; } = null!;

        public Kindergarten? KindergartenNumberNavigation { get; set; } = null;
        public User? User { get; set; } = null;
    }
}

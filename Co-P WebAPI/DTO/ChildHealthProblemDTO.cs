using CO_P_library.Models;

namespace Co_P_WebAPI.DTO
{
    public class ChildHealthProblemDTO
    {
        public string ChildId { get; set; } = null!;

        public string ChildName { get; set; } = string.Empty;
        public string HealthProblemName { get; set; } = string.Empty;
        public int Severity { get; set; }
        public string Care { get; set; } = null!;
        public string kindergartenNumber { get; set; } = null!;
        public int CurrentAcademicYear { get; set; }
        public virtual AcademicYear CurrentAcademicYearNavigation { get; set; } = null!;

        public virtual Kindergarten KindergartenNumberNavigation { get; set; } = null!;
        public virtual DiagnosedWith DiagnosedWith { get; set; } = null!;
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CO_P_library.Models
{
    public partial class UserInKindergarten
    {
        public DateTime StartDate { get; set; }
        public string KindergartenNumber { get; set; } = null!;
        public int CurrentAcademicYear { get; set; }
        public string? UserID { get; set; }

        public virtual User User { get; set; }
        public virtual Kindergarten Kindergarten { get; set; }
    }

}


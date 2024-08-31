using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CO_P_library.Models
{
    public partial class UserInKindergarten
    {
        public DateTime ActivityDate { get; set; }
        public int KindergartenNumber { get; set; }
        public int CurrentAcademicYear { get; set; }
        public string? UserID { get; set; }

        public int Number { get; set; }

        public virtual User User { get; set; }
        public virtual Kindergarten Kindergarten { get; set; }
    }

}


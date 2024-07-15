using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class AcademicYear
{
    public int CurrentAcademicYear { get; set; }

    public virtual ICollection<DaySummary> DaySummaries { get; set; } = new List<DaySummary>();

    public virtual ICollection<Duty> Duties { get; set; } = new List<Duty>();
}

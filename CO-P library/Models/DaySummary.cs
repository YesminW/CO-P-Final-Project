using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class DaySummary
{
    public DateTime DaySummaryDate { get; set; }

    public DateTime? DaySummaryHour { get; set; }

    public string SummaryDetails { get; set; } = null!;

    public int CurrentAcademicYear { get; set; }

    public string KindergartenNumber { get; set; } = null!;

    public virtual AcademicYear CurrentAcademicYearNavigation { get; set; } = null!;

    public virtual Kindergarten KindergartenNumberNavigation { get; set; } = null!;
}

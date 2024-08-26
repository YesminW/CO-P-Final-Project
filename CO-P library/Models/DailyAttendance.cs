using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class DailyAttendance
{
    public int DailyAttendanceId { get; set; }

    public DateTime Date { get; set; }

    public string ChildId { get; set; } = null!;

    public string? AttendanceStatus { get; set; }

    public virtual Child Child { get; set; } = null!;

   
}

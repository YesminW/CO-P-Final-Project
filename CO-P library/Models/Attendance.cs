using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class Attendance
{
    public int AttendanceCode { get; set; }

    public string AttendanceCodeName { get; set; } = null!;

    public virtual ICollection<DailyAttendance> DailyAttendanceAfternoonPresenceNavigations { get; set; } = new List<DailyAttendance>();

    public virtual ICollection<DailyAttendance> DailyAttendanceMorningPresenceNavigations { get; set; } = new List<DailyAttendance>();
}

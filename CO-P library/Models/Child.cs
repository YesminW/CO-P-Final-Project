using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class Child
{
    public string ChildId { get; set; } = null!;

    public string ChildFirstName { get; set; } = null!;

    public string ChildSurname { get; set; } = null!;

    public DateTime ChildBirthDate { get; set; }

    public string? ChildGender { get; set; }

    public int kindergartenNumber { get; set; }

    public int CurrentAcademicYear { get; set; }

    public string Parent1 { get; set; } = null!;

    public string Parent2 { get; set; } = null!;

    public string? ChildPhotoName { get; set; }

    public virtual ICollection<DailyAttendance> DailyAttendances { get; set; } = new List<DailyAttendance>();

    public virtual ICollection<DiagnosedWith> DiagnosedWiths { get; set; } = new List<DiagnosedWith>();

    public virtual ICollection<Duty> DutyChild1Navigations { get; set; } = new List<Duty>();

    public virtual ICollection<Duty> DutyChild2Navigations { get; set; } = new List<Duty>();

    public virtual User Parent1Navigation { get; set; } = null!;

    public virtual User Parent2Navigation { get; set; } = null!;
}

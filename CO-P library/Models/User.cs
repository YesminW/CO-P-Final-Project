using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class User
{
    public string UserId { get; set; } = null!;

    public string UserPrivetName { get; set; } = null!;

    public string UserSurname { get; set; } = null!;

    public DateTime? UserBirthDate { get; set; }

    public string? UserAddress { get; set; }

    public string UserPhoneNumber { get; set; } = null!;

    public string? UserGender { get; set; }

    public string? UserEmail { get; set; }

    public string UserpPassword { get; set; } = null!;

    public string KindergartenNumber { get; set; } = null!;

    public int CurrentAcademicYear { get; set; }

    public int UserCode { get; set; }

    public string? UserPhotoName { get; set; }

    public virtual ICollection<Child> ChildParent1Navigations { get; set; } = new List<Child>();

    public virtual ICollection<Child> ChildParent2Navigations { get; set; } = new List<Child>();

    public virtual ICollection<Interest> InterestsNumbers { get; set; } = new List<Interest>();
}

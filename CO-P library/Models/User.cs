using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class User
{
    public string? UserId { get; set; } 

    public string? UserPrivetName { get; set; } 

    public string? UserSurname { get; set; } 

    public DateTime? UserBirthDate { get; set; }

    public string? UserAddress { get; set; }

    public string? UserPhoneNumber { get; set; }

    public string? UserGender { get; set; }

    public string? UserEmail { get; set; }

    public string? UserpPassword { get; set; } 

    public int KindergartenNumber { get; set; } 

    public int CurrentAcademicYear { get; set; }

    public int UserCode { get; set; }

    public string? UserPhotoName { get; set; }

    public virtual ICollection<Child> ChildParent1Navigations { get; set; } = new List<Child>();

    public virtual ICollection<Child> ChildParent2Navigations { get; set; } = new List<Child>();

    public virtual ICollection<Interest> InterestsNumbers { get; set; } = new List<Interest>();
}

using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class ServedIn
{
    public int KindergartenNumber { get; set; } 

    public string KindergartenName { get; set; } = null!;

    public string MealType { get; set; } = null!;

    public string MealDetails { get; set; } = null!;

    public DateTime ActivityDate { get; set; }

    public virtual Kindergarten KindergartenNumberNavigation { get; set; } = null!;
}

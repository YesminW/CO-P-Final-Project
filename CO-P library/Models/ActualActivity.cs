using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class ActualActivity
{
    public int ActuaActivityNumber { get; set; }

    public DateTime ActivityDate { get; set; }

    public string? Equipment { get; set; }

    public int ActivityNumber { get; set; }

    public int? MealNumber { get; set; }

    public int KindergartenNumber { get; set; }

    public virtual ActivityType ActivityNumberNavigation { get; set; } = null!;

    public virtual Kindergarten KindergartenNumberNavigation { get; set; } = null!;

    public virtual Meal? MealNumberNavigation { get; set; }
}

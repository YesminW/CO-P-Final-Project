using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class Photo
{
    public int PhotoCode { get; set; }

    public DateTime? PhotoDate { get; set; }

    public DateTime? PhotoHour { get; set; }

    public int KindergartenNumber { get; set; }

    public virtual Kindergarten KindergartenNumberNavigation { get; set; } = null!;
}

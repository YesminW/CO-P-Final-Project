using System;
using System.Collections.Generic;

namespace CO_P_library.Models;

public partial class Interest
{
    public int InterestsNumber { get; set; }

    public string InterestsName { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}

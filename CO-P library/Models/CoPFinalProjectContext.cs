using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CO_P_library.Models
{
    public partial class CoPFinalProjectContext : DbContext
    {
        public CoPFinalProjectContext()
        {
        }

        public CoPFinalProjectContext(DbContextOptions<CoPFinalProjectContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AcademicYear> AcademicYears { get; set; }
        public virtual DbSet<ActivityType> ActivityTypes { get; set; }
        public virtual DbSet<ActualActivity> ActualActivities { get; set; }
        public virtual DbSet<Attendance> Attendances { get; set; }
        public virtual DbSet<Child> Children { get; set; }
        public virtual DbSet<DailyAttendance> DailyAttendances { get; set; }
        public virtual DbSet<DaySummary> DaySummaries { get; set; }
        public virtual DbSet<DiagnosedWith> DiagnosedWiths { get; set; }
        public virtual DbSet<Duty> Duties { get; set; }
        public virtual DbSet<HealthProblem> HealthProblems { get; set; }
        public virtual DbSet<Interest> Interests { get; set; }
        public virtual DbSet<Kindergarten> Kindergartens { get; set; }
        public virtual DbSet<Meal> Meals { get; set; }
        public virtual DbSet<Photo> Photos { get; set; }
        public virtual DbSet<ServedIn> ServedIns { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserInKindergarten> UserInKindergartens { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var config = new ConfigurationBuilder().AddJsonFile("appsettings.json", false).Build();
                string connStr = config.GetConnectionString("DefaultConnectionString");
                optionsBuilder.UseSqlServer(connStr);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // AcademicYear entity
            modelBuilder.Entity<AcademicYear>(entity =>
            {
                entity.HasKey(e => e.CurrentAcademicYear).HasName("PK_AcademicYear");

                entity.ToTable("AcademicYear");

                entity.Property(e => e.CurrentAcademicYear).ValueGeneratedNever();
            });

            // ActivityType entity
            modelBuilder.Entity<ActivityType>(entity =>
            {
                entity.HasKey(e => e.ActivityNumber).HasName("PK_ActivityType");

                entity.ToTable("ActivityType");

                entity.Property(e => e.ActivityName).HasMaxLength(20);
            });

            // ActualActivity entity
            modelBuilder.Entity<ActualActivity>(entity =>
            {
                entity.HasKey(e => e.ActuaActivityNumber).HasName("PK_ActualActivity");

                entity.ToTable("ActualActivity");

                entity.Property(e => e.ActivityDate).HasColumnType("date");
                entity.Property(e => e.Equipment).HasMaxLength(250);

                entity.HasOne(d => d.ActivityNumberNavigation).WithMany(p => p.ActualActivities)
                    .HasForeignKey(d => d.ActivityNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ActualActivity_ActivityType");

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.ActualActivities)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ActualActivity_Kindergarten");

                entity.HasOne(d => d.MealNumberNavigation).WithMany(p => p.ActualActivities)
                    .HasForeignKey(d => d.MealNumber)
                    .HasConstraintName("FK_ActualActivity_Meal");
            });

            // Attendance entity
            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.HasKey(e => e.AttendanceCode).HasName("PK_Attendance");

                entity.ToTable("Attendance");

                entity.Property(e => e.AttendanceCode).ValueGeneratedNever();
                entity.Property(e => e.AttendanceCodeName).HasMaxLength(50);
            });

            // Child entity
            modelBuilder.Entity<Child>(entity =>
            {
                entity.HasKey(e => e.ChildId).HasName("PK_Child");

                entity.ToTable("Child");

                entity.Property(e => e.ChildId)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("ChildID");

                entity.Property(e => e.ChildBirthDate).HasColumnType("datetime");
                entity.Property(e => e.ChildFirstName).HasMaxLength(10);
                entity.Property(e => e.ChildGender)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();
                entity.Property(e => e.ChildPhotoName).HasMaxLength(50);
                entity.Property(e => e.ChildSurname).HasMaxLength(10);
                entity.Property(e => e.kindergartenNumber)
                    .HasColumnName("KindergartenNumber")
                    .HasColumnType("int");
                entity.Property(e => e.Parent1)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("Parent_1");
                entity.Property(e => e.Parent2)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("Parent_2");

                entity.HasOne(d => d.Parent1Navigation).WithMany(p => p.ChildParent1Navigations)
                    .HasForeignKey(d => d.Parent1)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Child_Parent1");

                entity.HasOne(d => d.Parent2Navigation).WithMany(p => p.ChildParent2Navigations)
                    .HasForeignKey(d => d.Parent2)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Child_Parent2");
            });

            // DailyAttendance entity
            modelBuilder.Entity<DailyAttendance>(entity =>
            {
                entity.HasKey(e => e.DailyAttendanceId).HasName("PK_DailyAttendance");

                entity.ToTable("DailyAttendance");

                entity.HasIndex(e => new { e.ChildId, e.Date }, "UQ_DailyAttendance_ChildDate").IsUnique();

                entity.Property(e => e.DailyAttendanceId).HasColumnName("DailyAttendanceID");
                entity.Property(e => e.ChildId)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("ChildID");
                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.AttendanceStatus)
                    .HasMaxLength(1);

                entity.HasOne(d => d.Child).WithMany(p => p.DailyAttendances)
                    .HasForeignKey(d => d.ChildId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DailyAttendance_Child");
            });

            // DaySummary entity
            modelBuilder.Entity<DaySummary>(entity =>
            {
                entity.HasKey(e => e.DaySummaryDate).HasName("PK_DaySummary");

                entity.ToTable("DaySummary");

                entity.Property(e => e.DaySummaryDate).HasColumnType("datetime");
                entity.Property(e => e.SummaryDetails).HasMaxLength(500);

                entity.HasOne(d => d.CurrentAcademicYearNavigation).WithMany(p => p.DaySummaries)
                    .HasForeignKey(d => d.CurrentAcademicYear)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DaySummary_AcademicYear");

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.DaySummaries)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DaySummary_Kindergarten");
            });

            // DiagnosedWith entity
            modelBuilder.Entity<DiagnosedWith>(entity =>
            {
                entity.HasKey(e => new { e.ChildId, e.HealthProblemsNumber }).HasName("PK_DiagnosedWith");

                entity.ToTable("DiagnosedWith");

                entity.Property(e => e.ChildId)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("ChildID");
                entity.Property(e => e.Care).HasMaxLength(500);

                entity.HasOne(d => d.Child).WithMany(p => p.DiagnosedWiths)
                    .HasForeignKey(d => d.ChildId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DiagnosedWith_Child");

                entity.HasOne(d => d.HealthProblemsNumberNavigation).WithMany(p => p.DiagnosedWiths)
                    .HasForeignKey(d => d.HealthProblemsNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DiagnosedWith_HealthProblem");
            });

            // Duty entity
            modelBuilder.Entity<Duty>(entity =>
            {
                entity.HasKey(e => e.DutyDate).HasName("PK_Duty");

                entity.ToTable("Duty");

                entity.Property(e => e.DutyDate).HasColumnType("datetime");
                entity.Property(e => e.Child1)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("Child_1");
                entity.Property(e => e.Child2)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("Child_2");

                entity.HasOne(d => d.Child1Navigation).WithMany(p => p.DutyChild1Navigations)
                    .HasForeignKey(d => d.Child1)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Duty_Child1");

                entity.HasOne(d => d.Child2Navigation).WithMany(p => p.DutyChild2Navigations)
                    .HasForeignKey(d => d.Child2)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Duty_Child2");

                entity.HasOne(d => d.CurrentAcademicYearNavigation).WithMany(p => p.Duties)
                    .HasForeignKey(d => d.CurrentAcademicYear)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Duty_AcademicYear");

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.Duties)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Duty_Kindergarten");
            });

            // HealthProblem entity
            modelBuilder.Entity<HealthProblem>(entity =>
            {
                entity.HasKey(e => e.HealthProblemsNumber).HasName("PK_HealthProblem");

                entity.ToTable("HealthProblem");

                entity.Property(e => e.Care)
                    .HasMaxLength(100)
                    .HasColumnName("Care");
                entity.Property(e => e.HealthProblemName).HasMaxLength(20);
            });

            // Interest entity
            modelBuilder.Entity<Interest>(entity =>
            {
                entity.HasKey(e => e.InterestsNumber).HasName("PK_Interest");

                entity.ToTable("Interest");

                entity.Property(e => e.InterestsName)
                    .HasMaxLength(20)
                    .HasColumnName("InterestsName");
            });

            // Kindergarten entity
            modelBuilder.Entity<Kindergarten>(entity =>
            {
                entity.HasKey(e => e.KindergartenNumber).HasName("PK_Kindergarten");

                entity.ToTable("Kindergarten");

                entity.Property(e => e.KindergartenNumber)
                    .HasColumnName("KindergartenNumber")
                    .HasColumnType("int");

                entity.Property(e => e.KindergartenAddress).HasMaxLength(30);
                entity.Property(e => e.KindergartenName).HasMaxLength(20);

                // הוספת נוויגציה ל-UserInKindergarten
                entity.HasMany(k => k.UserInKindergartens)
                      .WithOne(u => u.Kindergarten)
                      .HasForeignKey(u => u.KindergartenNumber)
                      .HasConstraintName("FK_UserInKindergarten_Kindergarten");
            });

            // Meal entity
            modelBuilder.Entity<Meal>(entity =>
            {
                entity.HasKey(e => e.MealNumber).HasName("PK_Meal");

                entity.ToTable("Meal");

                entity.Property(e => e.MealDetails).HasMaxLength(100);
                entity.Property(e => e.MealType).HasMaxLength(20);
            });

            // Photo entity
            modelBuilder.Entity<Photo>(entity =>
            {
                entity.HasKey(e => e.PhotoCode).HasName("PK_Photo");

                entity.ToTable("Photo");

                entity.Property(e => e.PhotoDate).HasColumnType("datetime");
                entity.Property(e => e.PhotoHour).HasColumnType("datetime");

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.Photos)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Photo_Kindergarten");
            });

            // ServedIn entity
            modelBuilder.Entity<ServedIn>(entity =>
            {
                entity.HasKey(e => new { e.KindergartenNumber, e.MealType }).HasName("PK_ServedIn");

                entity.ToTable("ServedIn");

                entity.Property(e => e.MealType).HasMaxLength(20);
                entity.Property(e => e.ActivityDate).HasColumnType("date");
                entity.Property(e => e.KindergartenName).HasMaxLength(20);

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.ServedIns)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ServedIn_Kindergarten");
            });

            // User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId).HasName("PK_User");

                entity.ToTable("User");

                entity.Property(e => e.UserId)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("UserID");

                entity.Property(e => e.KindergartenNumber)
                    .HasColumnName("KindergartenNumber")
                    .HasColumnType("int");

                entity.Property(e => e.UserAddress).HasMaxLength(30);
                entity.Property(e => e.UserBirthDate).HasColumnType("datetime");
                entity.Property(e => e.UserEmail)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .IsFixedLength();
                entity.Property(e => e.UserGender)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .IsFixedLength();
                entity.Property(e => e.UserPhoneNumber)
                    .HasMaxLength(11)
                    .IsUnicode(false)
                    .IsFixedLength();
                entity.Property(e => e.UserPhotoName).HasMaxLength(50);
                entity.Property(e => e.UserPrivetName).HasMaxLength(10);
                entity.Property(e => e.UserSurname).HasMaxLength(10);
                entity.Property(e => e.UserpPassword).HasMaxLength(20);

                entity.HasMany(d => d.InterestsNumbers).WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "InterestsOfStaffMember",
                        r => r.HasOne<Interest>().WithMany()
                            .HasForeignKey("InterestsNumber")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK_InterestsOfStaffMember_Interest"),
                        l => l.HasOne<User>().WithMany()
                            .HasForeignKey("UserId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK_InterestsOfStaffMember_User"),
                        j =>
                        {
                            j.HasKey("UserId", "InterestsNumber").HasName("PK_InterestsOfStaffMember");
                            j.ToTable("InterestsOfStaffMember");
                            j.IndexerProperty<string>("UserId")
                                .HasMaxLength(9)
                                .IsUnicode(false)
                                .IsFixedLength()
                                .HasColumnName("UserID");
                        });
            });

            // UserInKindergarten entity
            modelBuilder.Entity<UserInKindergarten>(entity =>
            {
                entity.HasKey(u => u.Number).HasName("PK_UserInKindergarten");

                entity.ToTable("UserInKindergarten");

                entity.Property(u => u.ActivityDate).HasColumnType("datetime");

                entity.Property(u => u.TeacherID)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(u => u.Assistant1ID)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(u => u.Assistant2ID)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .IsFixedLength();

                // מיפוי של המפתחות הזרים לפי השמות הנכונים של המאפיינים במחלקה
                entity.HasOne(u => u.User)
                    .WithMany()
                    .HasForeignKey(u => u.TeacherID)
                    .HasConstraintName("FK_UserInKindergarten_Teacher");

                entity.HasOne(u => u.User)
                    .WithMany()
                    .HasForeignKey(u => u.Assistant1ID)
                    .HasConstraintName("FK_UserInKindergarten_Assistant1");

                entity.HasOne(u => u.User)
                    .WithMany()
                    .HasForeignKey(u => u.Assistant2ID)
                    .HasConstraintName("FK_UserInKindergarten_Assistant2");

                entity.HasOne(u => u.Kindergarten)
                    .WithMany(k => k.UserInKindergartens)
                    .HasForeignKey(u => u.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserInKindergarten_Kindergarten");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

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
            var config = new ConfigurationBuilder().AddJsonFile("appsettings.json", false).Build();
            string connStr = config.GetConnectionString("DefaultConnectionString");
            optionsBuilder.UseSqlServer(connStr);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AcademicYear>(entity =>
            {
                entity.HasKey(e => e.CurrentAcademicYear).HasName("PK__Academic__7E471AD32068CB9F");

                entity.ToTable("AcademicYear");

                entity.Property(e => e.CurrentAcademicYear).ValueGeneratedNever();
            });

            modelBuilder.Entity<ActivityType>(entity =>
            {
                entity.HasKey(e => e.ActivityNumber).HasName("PK__Activity__CA8A56128D65DECC");

                entity.ToTable("ActivityType");

                entity.Property(e => e.ActivityName).HasMaxLength(20);
            });

            // הגדרת המודל של UserInKindergarten עם Number כמפתח ראשי
            modelBuilder.Entity<UserInKindergarten>()
                .HasKey(u => u.Number);  // הגדרת Number כמפתח ראשי
            modelBuilder.Entity<UserInKindergarten>()
                .ToTable("UserInKindergarten");

            modelBuilder.Entity<ActualActivity>(entity =>
            {
                entity.HasKey(e => e.ActuaActivityNumber).HasName("PK__Actual A__0A3025C91B064C46");

                entity.ToTable("ActualActivity");

                entity.Property(e => e.ActivityDate).HasColumnType("date");
                entity.Property(e => e.Equipment).HasMaxLength(250);

                entity.HasOne(d => d.ActivityNumberNavigation).WithMany(p => p.ActualActivities)
                    .HasForeignKey(d => d.ActivityNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Actual Ac__Activ__3D5E1FD2");

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.ActualActivities)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Actual Ac__Kinde__3E52440B");

                entity.HasOne(d => d.MealNumberNavigation).WithMany(p => p.ActualActivities)
                    .HasForeignKey(d => d.MealNumber)
                    .HasConstraintName("FK__Actual Ac__MealN__3F466844");
            });

            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.HasKey(e => e.AttendanceCode).HasName("PK__Attendan__013780A3DDB9D27B");

                entity.ToTable("Attendance");

                entity.Property(e => e.AttendanceCode).ValueGeneratedNever();
                entity.Property(e => e.AttendanceCodeName).HasMaxLength(50);
            });

            modelBuilder.Entity<Child>(entity =>
            {
                entity.HasKey(e => e.ChildId).HasName("PK__Child__BEFA0736AA86AC72");

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
                    .HasConstraintName("FK__Child__Parent_1__14270015");

                entity.HasOne(d => d.Parent2Navigation).WithMany(p => p.ChildParent2Navigations)
                    .HasForeignKey(d => d.Parent2)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Child__Parent_2__151B244E");
            });

            modelBuilder.Entity<DailyAttendance>(entity =>
            {
                entity.HasKey(e => e.DailyAttendanceId).HasName("PK__DailyAtt__70B4ADABACA973F4");

                entity.ToTable("DailyAttendance");

                entity.HasIndex(e => new { e.ChildId, e.Date }, "UQ__DailyAtt__C98980E735B4A431").IsUnique();

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
                    .HasConstraintName("FK__DailyAtte__Child__5165187F");
            });

            modelBuilder.Entity<DaySummary>(entity =>
            {
                entity.HasKey(e => e.DaySummaryDate).HasName("PK__Day Summ__2F5D71782D9938D0");

                entity.ToTable("DaySummary");

                entity.Property(e => e.DaySummaryDate).HasColumnType("datetime");
                entity.Property(e => e.SummaryDetails).HasMaxLength(500);

                entity.HasOne(d => d.CurrentAcademicYearNavigation).WithMany(p => p.DaySummaries)
                    .HasForeignKey(d => d.CurrentAcademicYear)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Day Summa__Curre__04E4BC85");

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.DaySummaries)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Day Summa__Kinde__05D8E0BE");
            });

            modelBuilder.Entity<DiagnosedWith>(entity =>
            {
                entity.HasKey(e => new { e.ChildId, e.HealthProblemsNumber }).HasName("PK__Diagnose__BB2FE8CBA28E21EC");

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
                    .HasConstraintName("FK__Diagnosed__Child__0C85DE4D");

                entity.HasOne(d => d.HealthProblemsNumberNavigation).WithMany(p => p.DiagnosedWiths)
                    .HasForeignKey(d => d.HealthProblemsNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Diagnosed__Healt__0D7A0286");
            });

            modelBuilder.Entity<Duty>(entity =>
            {
                entity.HasKey(e => e.DutyDate).HasName("PK__Duty__34617F93B942B0F6");

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
                    .HasConstraintName("FK__Duty__Child_1__0F624AF8");

                entity.HasOne(d => d.Child2Navigation).WithMany(p => p.DutyChild2Navigations)
                    .HasForeignKey(d => d.Child2)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Duty__Child_2__10566F31");

                entity.HasOne(d => d.CurrentAcademicYearNavigation).WithMany(p => p.Duties)
                    .HasForeignKey(d => d.CurrentAcademicYear)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Duty__CurrentAca__00200768");

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.Duties)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Duty__Kindergart__01142BA1");
            });

            modelBuilder.Entity<HealthProblem>(entity =>
            {
                entity.HasKey(e => e.HealthProblemsNumber).HasName("PK__Health P__5D5EFFD1E38911BE");

                entity.Property(e => e.Care)
                    .HasMaxLength(100)
                    .HasColumnName("care");
                entity.Property(e => e.HealthProblemName).HasMaxLength(20);
            });

            modelBuilder.Entity<Interest>(entity =>
            {
                entity.HasKey(e => e.InterestsNumber).HasName("PK__Interest__00A5C748553F116A");

                entity.Property(e => e.InterestsName)
                    .HasMaxLength(20)
                    .HasColumnName("[InterestsName");
            });

            modelBuilder.Entity<Kindergarten>(entity =>
            {
                entity.HasKey(e => e.KindergartenNumber).HasName("PK__Kinderga__93EF919E32F59223");

                entity.ToTable("Kindergarten");

                entity.Property(e => e.KindergartenNumber)
                    .HasColumnName("KindergartenNumber")
                    .HasColumnType("int");

                entity.Property(e => e.KindergartenAddress).HasMaxLength(30);
                entity.Property(e => e.KindergartenName).HasMaxLength(20);
            });

            modelBuilder.Entity<Meal>(entity =>
            {
                entity.HasKey(e => e.MealNumber).HasName("PK__Meal__324604A062AF4F65");

                entity.ToTable("Meal");

                entity.Property(e => e.MealDetails).HasMaxLength(100);
                entity.Property(e => e.MealType).HasMaxLength(20);
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.HasKey(e => e.PhotoCode).HasName("PK__Photo__D954591EFB10F981");

                entity.ToTable("Photo");

                entity.Property(e => e.PhotoDate).HasColumnType("datetime");
                entity.Property(e => e.PhotoHour).HasColumnType("datetime");

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.Photos)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Photo__Kindergar__02FC7413");
            });

            modelBuilder.Entity<ServedIn>(entity =>
            {
                entity.HasKey(e => new { e.KindergartenNumber, e.MealType }).HasName("PK__Served I__2F0043293C83DAE4");

                entity.ToTable("ServedIn");

                entity.Property(e => e.MealType).HasMaxLength(20);
                entity.Property(e => e.ActivityDate).HasColumnType("date");
                entity.Property(e => e.KindergartenName).HasMaxLength(20);

                entity.HasOne(d => d.KindergartenNumberNavigation).WithMany(p => p.ServedIns)
                    .HasForeignKey(d => d.KindergartenNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Served In__Kinde__0A9D95DB");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId).HasName("PK__User__1788CCACF3B68D81");

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
                            .HasConstraintName("FK__Interests__Inter__07C12930"),
                        l => l.HasOne<User>().WithMany()
                            .HasForeignKey("UserId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__Interests__UserI__08B54D69"),
                        j =>
                        {
                            j.HasKey("UserId", "InterestsNumber").HasName("PK__Interest__878290D8EDB50D02");
                            j.ToTable("InterestsOfStaffMember");
                            j.IndexerProperty<string>("UserId")
                                .HasMaxLength(9)
                                .IsUnicode(false)
                                .IsFixedLength()
                                .HasColumnName("UserID");
                        });
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

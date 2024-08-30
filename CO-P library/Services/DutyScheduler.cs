using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CO_P_library.Models;

namespace CO_P_library.Services
{
    public class DutyScheduler
    {
        private readonly CoPFinalProjectContext _context;

        public DutyScheduler(CoPFinalProjectContext context)
        {
            _context = context;
        }

        public async Task GenerateAndSaveMonthlyDutyPairsAsync()
        {
            var children = await _context.Children.ToListAsync();
            var currentDate = DateTime.Now;
            int year = currentDate.Year;
            int month = currentDate.Month;

            List<(DateTime, Child, Child)> dutyPairs = GenerateMonthlyDutyPairs(children, year, month);

            foreach (var (dutyDate, child1, child2) in dutyPairs)
            {
                var duty = new Duty
                {
                    DutyDate = dutyDate,
                    Child1 = child1.ChildId,
                    Child2 = child2.ChildId,
                    CurrentAcademicYear = child1.CurrentAcademicYear,
                    KindergartenNumber = child1.kindergartenNumber
                };

                _context.Duties.Add(duty);
            }

            await _context.SaveChangesAsync();
        }

        public async Task GenerateAndSaveManualDutyPairsAsync(int year, int month)
        {
            var children = await _context.Children.ToListAsync();
            var currentDate = DateTime.Now;
            var remainingDays = Enumerable.Range(currentDate.Day, DateTime.DaysInMonth(year, month) - currentDate.Day + 1)
                                          .Select(day => new DateTime(year, month, day)).ToList();

            List<(DateTime, Child, Child)> dutyPairs = GenerateDutyPairsForRemainingDays(children, remainingDays);

            foreach (var (dutyDate, child1, child2) in dutyPairs)
            {
                var duty = new Duty
                {
                    DutyDate = dutyDate,
                    Child1 = child1.ChildId,
                    Child2 = child2.ChildId,
                    CurrentAcademicYear = child1.CurrentAcademicYear,
                    KindergartenNumber = child1.kindergartenNumber
                };

                _context.Duties.Add(duty);
            }

            await _context.SaveChangesAsync();
        }

        private List<(DateTime, Child, Child)> GenerateMonthlyDutyPairs(List<Child> children, int year, int month)
        {
            List<(DateTime, Child, Child)> dutyPairs = new List<(DateTime, Child, Child)>();
            Random random = new Random();

            int daysInMonth = DateTime.DaysInMonth(year, month);

            // Group children by Kindergarten
            var childrenByKindergarten = children.GroupBy(c => c.kindergartenNumber);

            foreach (var group in childrenByKindergarten)
            {
                var kindergartenChildren = group.ToList();

                // Shuffle the children list
                var shuffledChildren = kindergartenChildren.OrderBy(x => random.Next()).ToList();

                for (int day = 1; day <= daysInMonth; day++)
                {
                    DateTime dutyDate = new DateTime(year, month, day);
                    int childCount = shuffledChildren.Count;

                    for (int i = 0; i < childCount; i += 2)
                    {
                        if (i + 1 < childCount)
                        {
                            dutyPairs.Add((dutyDate, shuffledChildren[i], shuffledChildren[i + 1]));
                        }
                        else
                        {
                            // If there is an odd number of children, pair the last one with the first one
                            dutyPairs.Add((dutyDate, shuffledChildren[i], shuffledChildren[0]));
                        }
                    }

                    // Shuffle again for next day to ensure different pairs each day
                    shuffledChildren = shuffledChildren.OrderBy(x => random.Next()).ToList();
                }
            }

            return dutyPairs;
        }

        private List<(DateTime, Child, Child)> GenerateDutyPairsForRemainingDays(List<Child> children, List<DateTime> remainingDays)
        {
            List<(DateTime, Child, Child)> dutyPairs = new List<(DateTime, Child, Child)>();
            Random random = new Random();

            // Group children by Kindergarten
            var childrenByKindergarten = children.GroupBy(c => c.kindergartenNumber);

            foreach (var group in childrenByKindergarten)
            {
                var kindergartenChildren = group.ToList();

                // Shuffle the children list
                var shuffledChildren = kindergartenChildren.OrderBy(x => random.Next()).ToList();

                foreach (var dutyDate in remainingDays)
                {
                    int childCount = shuffledChildren.Count;

                    for (int i = 0; i < childCount; i += 2)
                    {
                        if (i + 1 < childCount)
                        {
                            dutyPairs.Add((dutyDate, shuffledChildren[i], shuffledChildren[i + 1]));
                        }
                        else
                        {
                            // If there is an odd number of children, pair the last one with the first one
                            dutyPairs.Add((dutyDate, shuffledChildren[i], shuffledChildren[0]));
                        }
                    }

                    // Shuffle again for next day to ensure different pairs each day
                    shuffledChildren = shuffledChildren.OrderBy(x => random.Next()).ToList();
                }
            }

            return dutyPairs;
        }
    }
}

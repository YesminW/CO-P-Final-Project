using CO_P_library.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;



namespace Co_P_WebAPI.Controllers
{
    [EnableCors()]
    public class ChildController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();


        [HttpGet]
        [Route("AllChild")]
        public dynamic GetAllChild()
        {
            IEnumerable<Child> children = db.Children.Select(x => new Child()
            {
                ChildId = x.ChildId,
                ChildFirstName = x.ChildFirstName,
                ChildSurname = x.ChildSurname,
                ChildBirthDate = x.ChildBirthDate,
                ChildGender = x.ChildGender,
                Parent1 = x.Parent1,
                Parent2 = x.Parent2
            });
            return children;

        }
        [HttpGet]
        [Route("GetChildByParent/{ParentID}")]
        public dynamic GetChildByParent(string ParentID)
        {
            var child = db.Children
               .Where(c => c.Parent1 == ParentID || c.Parent2 == ParentID)
               .FirstOrDefault();
            if (child == null)
            {
                return new { error = "Child not found" };
            }
            return child;

        }

        [HttpGet]
        [Route("GetChildByKindergarten")]
        public dynamic GetChildByKindergarten(int kindergartenNumber)
        {
            IEnumerable<Child> children = db.Children.Where(c=> c.kindergartenNumber == kindergartenNumber).Select(x => new Child()
            { 
                ChildFirstName = x.ChildFirstName,
                ChildSurname = x.ChildSurname,
            });
            return children;

        }

        [HttpPost]
        [Route("AddChildrenByExcel/{kindergartenNumber}/{currentAcademicYear}")]
        public async Task<IActionResult> UploadExcel(IFormFile file, int kindergartenNumber, int currentAcademicYear)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Please upload a valid Excel file.");
            }

            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial; // Set the license context

            var children = new List<Child>();


            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.First();
                    if (worksheet.Dimension == null)
                    {
                        return BadRequest("The Excel file is empty.");
                    }
                    var rowCount = worksheet.Dimension.Rows;
                    Console.WriteLine($"Row count: {rowCount}");

                    for (int row = 2; row <= rowCount; row++) // Assuming the first row is the header
                    {
                        var childId = worksheet.Cells[row, 1].Text;
                        var childFirstName = worksheet.Cells[row, 2].Text; // Change from int to string
                        var childSurname = worksheet.Cells[row, 3].Text;  // Change from int to string
                        var childBirthDate = DateTime.Parse(worksheet.Cells[row, 4].Text); // Parse DateTime
                        var childGender = worksheet.Cells[row, 5].Text;
                        var parent1 = worksheet.Cells[row, 6].Text;
                        var parent2 = worksheet.Cells[row, 7].Text;
                        var childPhotoName = worksheet.Cells[row, 8].Text;
                        


                        // Retrieve or create related entities as needed
                        var child = db.Children.FirstOrDefault(c => c.ChildId == childId);
                        if (child == null)
                        {
                            var newChild = new Child
                            {
                                ChildId = childId,
                                ChildFirstName = childFirstName,
                                ChildSurname = childSurname,
                                ChildBirthDate = childBirthDate,
                                ChildGender = childGender,
                                Parent1 = parent1,
                                Parent2 = parent2,
                                ChildPhotoName = childPhotoName,
                                CurrentAcademicYear = currentAcademicYear,
                                kindergartenNumber = kindergartenNumber
                            };
                           
                            children.Add(newChild);
                        }

                    }
                }

                db.Children.AddRange(children);
                db.SaveChanges();

                var allChild = db.Children.Select(x => new Child()
                {
                    ChildId = x.ChildId,
                    Parent1 = x.Parent1,
                    Parent2 = x.Parent2
                });


                return Ok(allChild);
            }


        }



        [HttpPost]
        [Route("AddChildren")]
        public dynamic addChild(string ID, string childFMame, string chilsSName, DateTime chilsBdate, string gender, string parent1, string parent2, int year, int kindergartenNumber)
        {
            Child c = new Child
            {
                ChildId = ID,
                ChildFirstName = childFMame,
                ChildSurname = chilsSName,
                ChildBirthDate = chilsBdate,
                ChildGender = gender,
                Parent1 = parent1,
                Parent2 = parent2,
                ChildPhotoName = " ",
                CurrentAcademicYear = year,
                kindergartenNumber = kindergartenNumber


            };

            db.Children.Add(c);
            db.SaveChanges();
            return Ok(c);
        }

        [HttpDelete]
        [Route("DeleteChild")]
        public dynamic DeleteChild(string ID)
        {
            Child? c = db.Children.Where(x => x.ChildId == ID).FirstOrDefault();
            if (c == null)
            {
                return ("Child not found");
            }
            db.Children.Remove(c);
            db.SaveChanges();
            return (c.ChildFirstName + " " + c.ChildSurname + "deleted");
        }

    }
}

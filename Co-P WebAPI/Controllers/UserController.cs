using CO_P_library.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace Co_P_WebAPI.Controllers
{
    [EnableCors()]
    public class UserController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("getAllUsers")]
        public dynamic GetAllUsers()
        {
            IEnumerable<User> users = db.Users.Select(x => new User()
            {
                UserId = x.UserId,
                UserPrivetName = x.UserPrivetName,
                UserSurname = x.UserSurname,
                UserBirthDate = x.UserBirthDate,
                UserAddress = x.UserAddress,
                UserPhoneNumber = x.UserPhoneNumber,
                UserGender = x.UserGender,
                UserEmail = x.UserEmail,
                UserpPassword = x.UserpPassword,
                UserCode = x.UserCode,

            });
            return users;

        }

        [HttpGet]
        [Route("GetOneUser/{ID}")]
        public dynamic GetOneUser(string ID)
        {
            User? u = db.Users.Where(x => x.UserId == ID).FirstOrDefault();
            return u;
        }


        [HttpPost]
        [Route("AddUser")]
        public dynamic AddUser(string ID, string privetName, string surName, DateTime Bdate, string phoneNumber, string password, int code, int year, string kinderName)
        {
            User u = new User();
            u.UserId = ID;
            u.UserPrivetName = privetName;
            u.UserSurname = surName;
            u.UserBirthDate = Bdate;
            u.UserPhoneNumber = phoneNumber;
            u.UserpPassword = password;
            u.UserCode = code;
            u.CurrentAcademicYear = year;
            u.KindergartenName = kinderName;

            db.Users.Add(u);
            db.SaveChanges();
            return Ok(u);
        }

        [HttpPost]
        [Route("AddUserByExcel")]
        public async Task<IActionResult> UploadUserExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Please upload a valid Excel file.");
            }

            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial; // Set the license context

            var users = new List<User>();
        


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
                        try
                        {
                            var userId = worksheet.Cells[row, 1].Text;
                            var userPrivetName = worksheet.Cells[row, 2].Text; // Change from int to string
                            var userSurname = worksheet.Cells[row, 3].Text;  // Change from int to string
                            var userBirthDate = DateTime.Parse(worksheet.Cells[row, 4].Text); // Parse DateTime
                            var userAddress = worksheet.Cells[row, 5].Text;
                            var userPhoneNumber = worksheet.Cells[row, 6].Text;
                            var userGender = worksheet.Cells[row, 7].Text;
                            var userEmail = worksheet.Cells[row, 8].Text;
                            var userpPassword = worksheet.Cells[row, 9].Text;
                            var userCode = int.Parse(worksheet.Cells[row, 10].Text);
                            var CurrentAcademicYear = 2024;
                            var KindergartenNumber = 1;

                            var user = db.Users.FirstOrDefault(u => u.UserId == userId);
                            if (user == null)
                            {
                                var newUser = new User
                                {
                                    UserId = userId,
                                    UserPrivetName = userPrivetName,
                                    UserSurname = userSurname,
                                    UserBirthDate = userBirthDate,
                                    UserAddress = userAddress,
                                    UserPhoneNumber = userPhoneNumber,
                                    UserGender = userGender,
                                    UserEmail = userEmail,
                                    UserpPassword = userpPassword,
                                    UserCode = userCode,
                                    UserPhotoName = null,
                                };
                               
                                users.Add(newUser);

                            }
                        }
                        catch (FormatException ex)
                        {
                            Console.WriteLine($"Row {row} has invalid data: {ex.Message}");
                            return BadRequest($"Row {row} has invalid data: {ex.Message}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Row {row} encountered an error: {ex.Message}");
                            return BadRequest($"Row {row} encountered an error: {ex.Message}");
                        }
                    }
                }
            }


            db.Users.AddRange(users);
            await db.SaveChangesAsync();



            return Ok(new { Message = "Data imported successfully." });
        }

        //[HttpPost]
        //public dynamic Parents(int code, int KindergartenNumber, int CurrentAcademicYear, string ID)
        //{
        //        var newP = new Parent
        //        {
        //            UserId = ID,
        //            CurrentAcademicYear = CurrentAcademicYear,
        //            KindergartenNumber = KindergartenNumber
        //        };
        //    db.Parents.Add(newP);
        //    db.SaveChanges();
        //    return Ok(new { Message = "Data imported successfully." });

        //}

        //[HttpPost]
        //public dynamic Staff(int code, int KindergartenNumber, int CurrentAcademicYear, string ID)
        //{
        //        var newS = new StaffMember
        //        {
        //            UserId = ID,
        //            CurrentAcademicYear = CurrentAcademicYear,
        //            KindergartenNumber = KindergartenNumber
        //        };
        //    db.StaffMembers.Add(newS);
        //    db.SaveChanges();
        //    return Ok(new { Message = "Data imported successfully." });
        //}

        [HttpPost]
        [Route("ManagerRegisterion")]
        public dynamic ManagerRegisterion([FromBody] User obj)
        {
            var manager = db.Users.FirstOrDefault(u => u.UserId == obj.UserId);
            if (manager == null)
            {
                var newManager = new User
                {
                    UserId = obj.UserId,
                    UserPrivetName = obj.UserPrivetName,
                    UserSurname = obj.UserSurname,
                    UserBirthDate = obj.UserBirthDate,
                    UserAddress = obj.UserAddress,
                    UserPhoneNumber = obj.UserPhoneNumber,
                    UserGender = obj.UserGender,
                    UserEmail = obj.UserEmail,
                    UserpPassword = obj.UserpPassword,
                    UserCode = 444
                };
                db.Users.Add(newManager);
                db.SaveChanges();
                return Ok(new { Message = "The manager Is registered" });

            }
            return BadRequest(new { Message = "Manager already registerd" });
        }

        [HttpPut]
        [Route("updateUser/{ID}")]
        public dynamic updateUser(string ID, [FromBody] User obj)
        {
            User? u = db.Users.Where(x => x.UserId == ID).FirstOrDefault();
            if (u != null)
            {
                if (obj.UserEmail != null)
                {
                    u.UserEmail = obj.UserEmail;
                }
                if (obj.UserAddress != null)
                {
                    u.UserAddress = obj.UserAddress;
                }
                if (obj.UserpPassword != null)
                {
                    u.UserpPassword = obj.UserpPassword;
                }
                if (obj.UserPhoneNumber != null)
                {
                    u.UserPhoneNumber = obj.UserPhoneNumber;
                }
                if (obj.UserGender != null)
                {
                    u.UserGender = obj.UserGender;
                }
                db.SaveChanges();
                return Ok(u);
            }
            else
            {
                return NotFound(new { message = "User not found" });
            }

        }

        [HttpDelete]
        [Route("DeleteUser")]
        public dynamic DeleteUser(string ID)
        {
            var us = db.Users.Where(u => u.UserId == ID).FirstOrDefault();
            if (us == null)
            {

                return ("User not found");
            }

            db.Users.Remove(us);
            db.SaveChanges();
            return (us.UserPrivetName + " " + us.UserSurname + "deleted");

        }

    }
}

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

        //-----------------------------------------------------------------------------------------------------------------------------------------------------//
        //GET - הבאת משתמשים//

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

        [HttpGet]
        [Route("GetAllTeacher")]
        public IActionResult GetAllUsersWithCode111()
        {
            var usersWithCode111 = db.Users
                                     .Where(u => u.UserCode == 111)
                                     .Select(u => new
                                     {
                                         u.UserPrivetName,
                                         u.UserSurname,
                                         u.UserId
                                     })
                                     .ToList();

            return Ok(usersWithCode111);
        }

        [HttpGet]
        [Route("GetAllAssistants")]
        public IActionResult GetAllAssistants()
        {
            var assistants = db.Users
                               .Where(u => u.UserCode == 333)
                               .Select(u => new
                               {
                                   u.UserPrivetName,
                                   u.UserSurname,
                                   u.UserId
                                  
                               })
                               .ToList();

            return Ok(assistants);
        }
        //-----------------------------------------------------------------------------------------------------------------------------------------------------//
        //POST - העלאת משתמשים //

        [HttpPost]
        [Route("AddUser")]
        public dynamic AddUser(string ID, string privetName, string surName, DateTime Bdate, string phoneNumber, string password, int code, int year, int kinderNumber)
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
            u.KindergartenNumber = kinderNumber;

            db.Users.Add(u);
            db.SaveChanges();
            return Ok(u);
        }

        [HttpPost]
        [Route("UploadStaffExcel")]
        public async Task<IActionResult> UploadStaffExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Please upload a valid Excel file.");
            }
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

            var users = new List<User>();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                    if (worksheet == null || worksheet.Dimension == null)
                    {
                        return BadRequest("The Excel file is empty.");
                    }

                    var rowCount = worksheet.Dimension.Rows;
                    for (int row = 2; row <= rowCount; row++) 
                    {
                        try
                        {
                            var userId = worksheet.Cells[row, 1].Text.Trim();
                            var userPrivetName = worksheet.Cells[row, 2].Text.Trim();
                            var userSurname = worksheet.Cells[row, 3].Text.Trim();
                            var userBirthDateStr = worksheet.Cells[row, 4].Text.Trim();
                            DateTime? userBirthDate = null;
                            if (DateTime.TryParse(userBirthDateStr, out var parsedDate))
                            {
                                userBirthDate = parsedDate;
                            }
                            var userAddress = worksheet.Cells[row, 5].Text.Trim();
                            var userPhoneNumber = worksheet.Cells[row, 6].Text.Trim();
                            var userGender = worksheet.Cells[row, 7].Text.Trim();
                            var userEmail = worksheet.Cells[row, 8].Text.Trim();
                            var userpPassword = worksheet.Cells[row, 9].Text.Trim();
                            var userCodeStr = worksheet.Cells[row, 10].Text.Trim();
                            int userCode;
                            if (!int.TryParse(userCodeStr, out userCode))
                            {
                                return BadRequest($"Row {row}: Invalid number format in column 'UserCode': {userCodeStr}");
                            }

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
                                    KindergartenNumber = 0,  
                                    CurrentAcademicYear = 0,   
                                    UserPhotoName = null       
                                };

                                users.Add(newUser);
                            }
                        }
                        catch (Exception ex)
                        {
                            return BadRequest($"Row {row}: An error occurred: {ex.Message}");
                        }
                    }
                }
            }

            db.Users.AddRange(users);
            await db.SaveChangesAsync();

            return Ok(new { Message = "Staff data imported successfully." });
        }

        [HttpPost]
        [Route("UploadParentsExcel/{kindergartenNumber}/{currentAcademicYear}")]
        public async Task<IActionResult> UploadParentsExcel(IFormFile file, int kindergartenNumber, int currentAcademicYear)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Please upload a valid Excel file.");
            }

            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial; 

            var users = new List<User>();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                    if (worksheet == null || worksheet.Dimension == null)
                    {
                        return BadRequest("The Excel file is empty.");
                    }

                    var rowCount = worksheet.Dimension.Rows;
                    for (int row = 2; row <= rowCount; row++) 
                    {
                        try
                        {
                            var userId = worksheet.Cells[row, 1].Text.Trim();
                            var userPrivetName = worksheet.Cells[row, 2].Text.Trim();
                            var userSurname = worksheet.Cells[row, 3].Text.Trim();
                            var userBirthDateStr = worksheet.Cells[row, 4].Text.Trim();
                            DateTime? userBirthDate = null;
                            if (DateTime.TryParse(userBirthDateStr, out var parsedDate))
                            {
                                userBirthDate = parsedDate;
                            }
                            var userAddress = worksheet.Cells[row, 5].Text.Trim();
                            var userPhoneNumber = worksheet.Cells[row, 6].Text.Trim();
                            var userGender = worksheet.Cells[row, 7].Text.Trim();
                            var userEmail = worksheet.Cells[row, 8].Text.Trim();
                            var userpPassword = worksheet.Cells[row, 9].Text.Trim();
                            var userCodeStr = worksheet.Cells[row, 10].Text.Trim();
                            int userCode;
                            if (!int.TryParse(userCodeStr, out userCode))
                            {
                                return BadRequest($"Row {row}: Invalid number format in column 'UserCode': {userCodeStr}");
                            }

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
                                    KindergartenNumber = kindergartenNumber,  
                                    CurrentAcademicYear = currentAcademicYear, 
                                    UserPhotoName = null 
                                };

                                users.Add(newUser);
                            }
                        }
                        catch (Exception ex)
                        {
                            return BadRequest($"Row {row}: An error occurred: {ex.Message}");
                        }
                    }
                }
            }

            db.Users.AddRange(users);
            await db.SaveChangesAsync();

            return Ok(new { Message = "Parents data imported successfully." });
        }

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

        //-----------------------------------------------------------------------------------------------------------------------------------------------------//
        //PUT - עדכונים //

        [HttpPut]
        [Route("AssignStaffToKindergarten/{kindergartenNumber}/{currentAcademicYear}/{firstName}/{lastName}")]
        public IActionResult AssignStaffToKindergarten(int kindergartenNumber, int currentAcademicYear, string firstName, string lastName)
        {
            var user = db.Users.FirstOrDefault(u => u.UserPrivetName == firstName && u.UserSurname == lastName);

            if (user == null)
            {
                return NotFound(new { Message = "User not found with the given first name and last name." });
            }

            user.KindergartenNumber = kindergartenNumber;
            user.CurrentAcademicYear = currentAcademicYear;
            db.Users.Update(user);

            db.SaveChanges();

            return Ok(new { Message = "Staff assigned to kindergarten and user information updated successfully." });
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
        //-----------------------------------------------------------------------------------------------------------------------------------------------------//
        //DELETE - מחיקת משתמש //

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

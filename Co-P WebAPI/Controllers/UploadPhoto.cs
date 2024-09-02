using CO_P_library.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;

namespace Co_P_WebAPI.Controllers
{
    [EnableCors()]
    public class UploadPhoto : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpPut]
        [Route("UploadChildPhoto/{ID}")]
        public async Task<IActionResult> UploadChildPhoto(IFormFile file, string ID)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // יצירת נתיב לתיקיית הילד בתוך ChildPhotos
            var childFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "ChildPhotos", ID);

            if (!Directory.Exists(childFolderPath))
            {
                Directory.CreateDirectory(childFolderPath);
            }

            var fileName = $"{ID}{Path.GetExtension(file.FileName)}"; // שם הקובץ הוא ת"ז הילד עם סיומת הקובץ
            var filePath = Path.Combine(childFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            Child c = db.Children.Where(x => x.ChildId == ID).FirstOrDefault();
            c.ChildPhotoName = ID; // שומר את שם התיקייה (ת"ז הילד) בעמודת ה-ChildPhotoName
            db.SaveChanges();

            return Ok(new { fileName = fileName, filePath = filePath });
        }


        [HttpGet]
        [Route("GetChildimage/{primaryKey}")]
        public IActionResult GetChildimage(string primaryKey)
        {
            // יצירת נתיב לתיקיית הילד בתוך ChildPhotos
            var childFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "ChildPhotos", primaryKey);
            var file = Directory.GetFiles(childFolderPath, $"{primaryKey}.*").FirstOrDefault();

            if (file == null)
            {
                return ("אין תמונה");
            }

            var fileType = Path.GetExtension(file).ToLower();

            var contentType = fileType switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".pdf" => "application/pdf",
                ".txt" => "text/plain",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                _ => "application/octet-stream",
            };

            var image = System.IO.File.OpenRead(file);
            return File(image, contentType);
        }


        [HttpDelete]
        [Route("DeleteChildPhoto/{primaryKey}")]
        public dynamic DeleteChildPhoto(string primaryKey)
        {
            // יצירת נתיב לתיקיית הילד בתוך ChildPhotos
            var childFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "ChildPhotos", primaryKey);
            if (!Directory.Exists(childFolderPath))
            {
                return NotFound();
            }

            Directory.Delete(childFolderPath, true); // מחיקת התיקייה וכל התוכן שבה

            Child child = db.Children.Where(x => x.ChildId == primaryKey).First();
            child.ChildPhotoName = ""; // ניקוי שם התיקייה מהדאטהבייס
            db.SaveChanges();

            return "Photo deleted";
        }


        [HttpPut]
        [Route("UploadUserPhoto/{ID}")]
        public async Task<IActionResult> UploadUserPhoto(IFormFile file, string ID)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // יצירת נתיב לתיקיית המשתמש בתוך UserPhotos
            var userFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "UserPhotos", ID);

            if (!Directory.Exists(userFolderPath))
            {
                Directory.CreateDirectory(userFolderPath);
            }

            var fileName = $"{ID}{Path.GetExtension(file.FileName)}"; // שם הקובץ הוא ת"ז המשתמש עם סיומת הקובץ
            var filePath = Path.Combine(userFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            User user = db.Users.Where(x => x.UserId == ID).First();
            user.UserPhotoName = ID; // שומר את שם התיקייה (ת"ז המשתמש) בעמודת ה-UserPhotoName
            db.SaveChanges();

            return Ok(new { fileName = fileName, filePath = filePath });
        }



        [HttpGet]
        [Route("GetUserimage")]
        public IActionResult GetUserimage(string primaryKey)
        {
            // יצירת נתיב לתיקיית המשתמש בתוך UserPhotos
            var userFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "UserPhotos", primaryKey);
            var file = Directory.GetFiles(userFolderPath, $"{primaryKey}.*").FirstOrDefault();

            if (file == null)
            {
                return ("אין תמונה");
            }

            var fileType = Path.GetExtension(file).ToLower();

            var contentType = fileType switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".pdf" => "application/pdf",
                ".txt" => "text/plain",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                _ => "application/octet-stream",
            };

            var image = System.IO.File.OpenRead(file);
            return File(image, contentType);
        }


        [HttpDelete]
        [Route("DeleteUserPhoto")]
        public dynamic DeleteUserPhoto(string primaryKey)
        {
            // יצירת נתיב לתיקיית המשתמש בתוך UserPhotos
            var userFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "UserPhotos", primaryKey);
            if (!Directory.Exists(userFolderPath))
            {
                return NotFound();
            }

            Directory.Delete(userFolderPath, true); // מחיקת התיקייה וכל התוכן שבה

            User user = db.Users.Where(x => x.UserId == primaryKey).First();
            user.UserPhotoName = ""; // ניקוי שם התיקייה מהדאטהבייס
            db.SaveChanges();

            return "Photo deleted";
        }


        [HttpPost]
        [Route("UploadChildrenPhotos/{kindergartenNumber}")]
        public async Task<IActionResult> UploadChildrenPhotos(List<IFormFile> files, int kindergartenNumber)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded");

            // נתיב הבסיס לשמירת התמונות לפי מספר הגן
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "KindergartenPhotos", kindergartenNumber.ToString());

            if (!Directory.Exists(basePath))
            {
                Directory.CreateDirectory(basePath);
            }

            var uploadedFiles = new List<object>();

            // קבלת המספר הרץ האחרון שנשמר בתיקייה
            int runningNumber = Directory.GetFiles(basePath).Length + 1;

            foreach (var file in files)
            {
                // יצירת שם הקובץ על בסיס מספר רץ + מספר הגן
                var fileName = $"{runningNumber}_{kindergartenNumber}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(basePath, fileName);

                // שמירת התמונה בתיקייה של הגן
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // עדכון המספר הרץ
                runningNumber++;

                uploadedFiles.Add(new { fileName = fileName, filePath = filePath });
            }

            return Ok(uploadedFiles);
        }

        [HttpGet]
        [Route("GetPhotosByKindergarten/{kindergartenNumber}")]
        public IActionResult GetPhotosByKindergarten(int kindergartenNumber)
        {
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "KindergartenPhotos", kindergartenNumber.ToString());

            if (!Directory.Exists(basePath))
            {
                return NotFound("תיקייה לא נמצאה עבור מספר הגן המסוים הזה.");
            }

            var files = Directory.GetFiles(basePath);

            if (files.Length == 0)
            {
                return NotFound("לא נמצאו תמונות עבור מספר הגן המסוים הזה.");
            }

            var photos = new List<object>();

            foreach (var file in files)
            {
                var imageBytes = System.IO.File.ReadAllBytes(file);
                var base64String = Convert.ToBase64String(imageBytes);
                var fileName = Path.GetFileName(file);

                photos.Add(new
                {
                    FileName = fileName,
                    Base64Image = $"data:image/jpeg;base64,{base64String}" // או להחליף את הפורמט בהתאם לסיומת הקובץ
                });
            }

            return Ok(photos);
        }



    }
}

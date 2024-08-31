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

            var ProfilePath = Path.Combine(Directory.GetCurrentDirectory(), "ChildPhotos"); // שם התקייה בC#

            if (!Directory.Exists(ProfilePath))
            {
                Directory.CreateDirectory(ProfilePath);
            }
            var fileName = string.IsNullOrEmpty(ID.ToString()) // שם התמונה יהיה תז הילד
                ? file.FileName
                : $"{ID}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(ProfilePath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            Child c = db.Children.Where(x => x.ChildId == ID).FirstOrDefault();
            c.ChildPhotoName = fileName;
            db.SaveChanges();

            return Ok(new { fileName = fileName, filePath = filePath });
        }


        [HttpGet]
        [Route("GetChildimage")]
        public IActionResult GetChildimage(string primaryKey)
        {
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "ChildPhotos");
            var file = Directory.GetFiles(imagesPath, $"{primaryKey}.*").FirstOrDefault();

            if (file == null)
            {
                return NotFound();
            }

            var fileType = Path.GetExtension(file).ToLower();

            // Determine the content type based on the file extension.
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
        [Route("DeleteChildPhoto")]
        public dynamic DeleteChildPhoto(string primaryKey)
        {
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "ChildPhotos");
            var file = Directory.GetFiles(imagesPath, $"{primaryKey}.*").FirstOrDefault();
            if (file == null)
            {
                return NotFound();
            }
            var fileType = Path.GetExtension(file).ToLower();

            Child child = db.Children.Where(x => x.ChildId == primaryKey).First();
            child.ChildPhotoName = "";
            db.SaveChanges();

            return "Photo deleted";
        }



        [HttpPut]
        [Route("UploadUserPhoto/{ID}")]
        public async Task<IActionResult> UploadUserPhoto(IFormFile file, string ID)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var ProfilePath = Path.Combine(Directory.GetCurrentDirectory(), "UserPhoto"); //שם התקייה

            if (!Directory.Exists(ProfilePath))
            {
                Directory.CreateDirectory(ProfilePath);
            }
            var fileName = string.IsNullOrEmpty(ID.ToString()) // שם התמונה יהיה תז של המשתמש
                ? file.FileName
                : $"{ID}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(ProfilePath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            User user = db.Users.Where(x => x.UserId == ID).First();
            user.UserPhotoName = fileName;
            db.SaveChanges();

            return Ok(new { fileName = fileName, filePath = filePath });
        }


        [HttpGet]
        [Route("GetUserimage")]
        public IActionResult GetUserimage(string primaryKey)
        {
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "UserPhoto");
            var file = Directory.GetFiles(imagesPath, $"{primaryKey}.*").FirstOrDefault();

            if (file == null)
            {
                return NotFound();
            }

            var fileType = Path.GetExtension(file).ToLower();

            // Determine the content type based on the file extension.
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
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "ChildPhotos");
            var file = Directory.GetFiles(imagesPath, $"{primaryKey}.*").FirstOrDefault();
            if (file == null)
            {
                return NotFound();
            }
            var fileType = Path.GetExtension(file).ToLower();

            User user = db.Users.Where(x => x.UserId == primaryKey).First();
            user.UserPhotoName = "";
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

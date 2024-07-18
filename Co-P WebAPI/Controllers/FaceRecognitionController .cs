using CO_P_library.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Newtonsoft.Json;
using Azure.Storage.Blobs;
using Newtonsoft.Json.Linq;

namespace Co_P_WebAPI.Controllers
{
    public class FaceRecognitionController : Controller
    {
        private static readonly string subscriptionKey = "baf3bf9f1fb74734ac32857edb1b6217";
        private static readonly string endpoint = "https://co-p.cognitiveservices.azure.com/";
        private static readonly string connectionString = "DefaultEndpointsProtocol=https;AccountName=copfacerecognition;AccountKey=pFZqSXxubrn436Bj7eSgGtsoe+37QxjGZngaXqB5bbua6hI+GrHC6/bQoTsjerFkYKzFW+thdTfW+AStqCz4bg==;EndpointSuffix=core.windows.net";
        private static readonly string containerName = "co-p-face-recognition";
        private static readonly string personGroupId = "73d64f68-f6d5-44b6-8975-62f684e7ff2b";

        public FaceRecognitionController() { }

        [HttpPost]
        [Route("api/FaceRecognition/ProcessImage")]
        public async Task<IActionResult> ProcessImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            byte[] byteData;
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                byteData = memoryStream.ToArray();
            }

            // Detect and identify face using Azure Face API
            string faceId = await DetectFaceAsync(byteData);
            List<string> childIds = await IdentifyFaceAsync(personGroupId, faceId);

            // Save image locally in folders named by child IDs
            string fileName = file.FileName;
            SaveImageLocally(childIds.ToArray(), byteData, fileName);

            // Upload image to Azure Blob Storage
            foreach (string childId in childIds)
            {
                string blobName = $"{childId}/{fileName}";
                await UploadImageToAzureAsync(byteData, blobName);
            }

            return Ok(new { message = "Image processed successfully." });
        }

        public static async Task<string> DetectFaceAsync(byte[] byteData)
        {
            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

            string uri = $"{endpoint}/face/v1.0/detect?returnFaceId=true";

            using ByteArrayContent content = new ByteArrayContent(byteData);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

            // Log request details
            Console.WriteLine($"Request URL: {uri}");
            Console.WriteLine($"Request Headers: {client.DefaultRequestHeaders}");
            Console.WriteLine($"Request Content Type: {content.Headers.ContentType}");
            Console.WriteLine($"Request Content Length: {byteData.Length}");

            HttpResponseMessage response = await client.PostAsync(uri, content);
            string responseContent = await response.Content.ReadAsStringAsync();

            // Log response details
            Console.WriteLine($"Response Status Code: {response.StatusCode}");
            Console.WriteLine($"Response Content: {responseContent}");

            if (!response.IsSuccessStatusCode)
            {
                // Log the response content for debugging purposes
                throw new Exception($"Error: {responseContent}");
            }

            var faces = JsonConvert.DeserializeObject<List<dynamic>>(responseContent);

            if (faces == null || faces.Count == 0)
            {
                throw new Exception("No face detected.");
            }

            return faces[0].faceId.ToString();
        }



        public static async Task<List<string>> IdentifyFaceAsync(string personGroupId, string faceId)
        {
            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

            string uri = $"{endpoint}/face/v1.0/identify";

            string json = $"{{\"personGroupId\":\"{personGroupId}\",\"faceIds\":[\"{faceId}\"]}}";
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(uri, content);
            string responseContent = await response.Content.ReadAsStringAsync();

            dynamic result = JsonConvert.DeserializeObject(responseContent);
            List<string> childIds = new List<string>();

            if (result != null && result.Count > 0 && result[0].candidates != null)
            {
                foreach (var candidate in result[0].candidates)
                {
                    childIds.Add(candidate.personId.ToString());
                }
            }

            return childIds;
        }

        public static void SaveImageLocally(string[] childIds, byte[] byteData, string fileName)
        {
            foreach (string childId in childIds)
            {
                string directoryPath = Path.Combine("C:\\Images", childId);
                Directory.CreateDirectory(directoryPath);

                string destinationPath = Path.Combine(directoryPath, fileName);
                System.IO.File.WriteAllBytes(destinationPath, byteData);
            }
        }

        public static async Task UploadImageToAzureAsync(byte[] byteData, string blobName)
        {
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            BlobClient blobClient = containerClient.GetBlobClient(blobName);

            using var memoryStream = new MemoryStream(byteData);
            await blobClient.UploadAsync(memoryStream, true);
        }
    }
}

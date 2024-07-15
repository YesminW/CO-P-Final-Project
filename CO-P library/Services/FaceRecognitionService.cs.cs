using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace CO_P_library.Services
{
    public class FaceRecognitionService
    {
        private readonly string primarySubscriptionKey;
        private readonly string secondarySubscriptionKey;
        private readonly string endpoint;

        public FaceRecognitionService(IConfiguration configuration)
        {
            primarySubscriptionKey = configuration["AzureFaceApi:PrimarySubscriptionKey"];
            secondarySubscriptionKey = configuration["AzureFaceApi:SecondarySubscriptionKey"];
            endpoint = configuration["AzureFaceApi:Endpoint"];
        }

        public async Task<string> DetectFacesAsync(byte[] imageBytes)
        {
            var client = new HttpClient();
            string contentString = await SendRequestAsync(client, imageBytes, primarySubscriptionKey);

            // אם המפתח הראשי נכשל, נסה את המפתח המשני
            if (string.IsNullOrEmpty(contentString))
            {
                contentString = await SendRequestAsync(client, imageBytes, secondarySubscriptionKey);
            }

            return contentString;
        }

        private async Task<string> SendRequestAsync(HttpClient client, byte[] imageBytes, string subscriptionKey)
        {
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

            string uri = endpoint + "/face/v1.0/detect?returnFaceId=true&returnFaceAttributes=emotion";

            using (var content = new ByteArrayContent(imageBytes))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                var response = await client.PostAsync(uri, content);
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                return null;
            }
        }
    }

}

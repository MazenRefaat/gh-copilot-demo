using Microsoft.Data.SqlClient;
using System.Data;
using System.Text;

namespace UnsecureApp.Controllers
{
    public class MyController
    {
        private readonly string _allowedDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data");

        public string ReadFile(string userInput)
        {
            if (string.IsNullOrWhiteSpace(userInput))
                throw new ArgumentException("File path cannot be null or empty", nameof(userInput));

            string validatedPath = ValidateFilePath(userInput);
            
            using (FileStream fs = OpenFileStream(validatedPath))
            {
                return ReadBytesFromStream(fs);
            }
        }

        public async Task<string> ReadFileAsync(string userInput)
        {
            if (string.IsNullOrWhiteSpace(userInput))
                throw new ArgumentException("File path cannot be null or empty", nameof(userInput));

            string validatedPath = ValidateFilePath(userInput);
            
            using (FileStream fs = OpenFileStream(validatedPath))
            {
                return await ReadBytesFromStreamAsync(fs);
            }
        }

        private string ValidateFilePath(string filePath)
        {
            string fullPath = Path.GetFullPath(Path.Combine(_allowedDirectory, filePath));
            
            if (!fullPath.StartsWith(_allowedDirectory, StringComparison.Ordinal))
            {
                throw new UnauthorizedAccessException("Access to the specified path is denied");
            }
            
            return fullPath;
        }

        private FileStream OpenFileStream(string filePath)
        {
            return File.Open(filePath, FileMode.Open);
        }

        private string ReadBytesFromStream(FileStream fs)
        {
            const int bufferSize = 1024;
            using (var memoryStream = new MemoryStream())
            {
                byte[] buffer = new byte[bufferSize];
                int bytesRead;
                
                while ((bytesRead = fs.Read(buffer, 0, buffer.Length)) > 0)
                {
                    memoryStream.Write(buffer, 0, bytesRead);
                }
                
                return Encoding.UTF8.GetString(memoryStream.ToArray());
            }
        }

        private async Task<string> ReadBytesFromStreamAsync(FileStream fs)
        {
            const int bufferSize = 1024;
            using (var memoryStream = new MemoryStream())
            {
                byte[] buffer = new byte[bufferSize];
                int bytesRead;
                
                while ((bytesRead = await fs.ReadAsync(buffer, 0, buffer.Length)) > 0)
                {
                    await memoryStream.WriteAsync(buffer, 0, bytesRead);
                }
                
                return Encoding.UTF8.GetString(memoryStream.ToArray());
            }
        }

        public int GetProduct(string productName)
        {
            if (string.IsNullOrWhiteSpace(productName))
                throw new ArgumentException("Product name cannot be null or empty", nameof(productName));

            using (SqlConnection connection = CreateConnection())
            {
                connection.Open();
                using (SqlCommand sqlCommand = CreateProductCommand(productName, connection))
                {
                    return ExecuteProductQuery(sqlCommand);
                }
            }
        }

        public async Task<int> GetProductAsync(string productName)
        {
            if (string.IsNullOrWhiteSpace(productName))
                throw new ArgumentException("Product name cannot be null or empty", nameof(productName));

            using (SqlConnection connection = CreateConnection())
            {
                await connection.OpenAsync();
                using (SqlCommand sqlCommand = CreateProductCommand(productName, connection))
                {
                    return await ExecuteProductQueryAsync(sqlCommand);
                }
            }
        }

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(connectionString);
        }

        private SqlCommand CreateProductCommand(string productName, SqlConnection connection)
        {
            var command = new SqlCommand()
            {
                CommandText = "SELECT ProductId FROM Products WHERE ProductName = @ProductName",
                CommandType = CommandType.Text,
                Connection = connection
            };
            command.Parameters.AddWithValue("@ProductName", productName);
            return command;
        }

        private int ExecuteProductQuery(SqlCommand command)
        {
            using (SqlDataReader reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return reader.GetInt32(0);
                }
                throw new InvalidOperationException($"No product found");
            }
        }

        private async Task<int> ExecuteProductQueryAsync(SqlCommand command)
        {
            using (SqlDataReader reader = await command.ExecuteReaderAsync())
            {
                if (await reader.ReadAsync())
                {
                    return reader.GetInt32(0);
                }
                throw new InvalidOperationException($"No product found");
            }
        }

        private string connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING") ?? "";
    }
}
using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;

namespace LosCarrosDeBeto.API.Services
{
    public class ContractService : IContractService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ContractService(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<string> GenerateContractHtmlAsync(int rentalId)
        {
            var rental = await _context.Rentals
                .Include(r => r.Client)
                .Include(r => r.Vehicle)
                    .ThenInclude(v => v.Administrator)
                .FirstOrDefaultAsync(r => r.Id == rentalId);

            if (rental == null)
            {
                throw new KeyNotFoundException("Alquiler no encontrado");
            }

            var vehicle = rental.Vehicle;
            var client = rental.Client;
            var owner = vehicle?.Administrator;

            // Path to template
            var templatePath = Path.Combine(_env.ContentRootPath, "Template", "Contrato-de-arrendamiento-Vehiculo-.html");
            if (!File.Exists(templatePath))
            {
                 throw new FileNotFoundException("Plantilla no encontrada", templatePath);
            }

            string templateContent = await File.ReadAllTextAsync(templatePath);

            // Ensure owner exists
            if (owner == null)
            {
                throw new InvalidOperationException("El vehículo no tiene un administrador asignado. El contrato requiere un propietario.");
            }

            // Owner Data - Use actual data or underscore placeholders if missing
            var ownerName = !string.IsNullOrWhiteSpace(owner.Name) ? owner.Name : "_________________";
            var ownerDoc = !string.IsNullOrWhiteSpace(owner.Document) ? owner.Document : "_________________";
            var ownerAddress = !string.IsNullOrWhiteSpace(owner.Address) ? owner.Address : "_________________";
            var ownerPhone = !string.IsNullOrWhiteSpace(owner.Phone) ? owner.Phone : "_________________";
            var ownerCity = !string.IsNullOrWhiteSpace(owner.City) ? owner.City : "_________________";
            var ownerLicense = !string.IsNullOrWhiteSpace(owner.LicenseNumber) ? owner.LicenseNumber : "_________________";

            // Safe Replace
            templateContent = templateContent.Replace("{{OWNER_NAME}}", ownerName);
            templateContent = templateContent.Replace("{{OWNER_DOC}}", ownerDoc);
            templateContent = templateContent.Replace("{{OWNER_ADDRESS}}", ownerAddress);
            templateContent = templateContent.Replace("{{OWNER_PHONE}}", ownerPhone);
            templateContent = templateContent.Replace("{{OWNER_CELL}}", ownerPhone);
            templateContent = templateContent.Replace("{{OWNER_CITY}}", ownerCity);
            templateContent = templateContent.Replace("{{OWNER_LICENSE}}", ownerLicense);

            // Client Replacements check for nulls just in case
            if (client != null)
            {
                templateContent = templateContent.Replace("{{CLIENT_NAME}}", !string.IsNullOrWhiteSpace(client.Name) ? client.Name : "_________________");
                templateContent = templateContent.Replace("{{CLIENT_DOC}}", !string.IsNullOrWhiteSpace(client.Document) ? client.Document : "_________________");
                templateContent = templateContent.Replace("{{CLIENT_ADDRESS}}", !string.IsNullOrWhiteSpace(client.Address) ? client.Address : "_________________");
                templateContent = templateContent.Replace("{{CLIENT_PHONE}}", !string.IsNullOrWhiteSpace(client.Phone) ? client.Phone : "_________________");
                templateContent = templateContent.Replace("{{CLIENT_CELL}}", !string.IsNullOrWhiteSpace(client.Phone) ? client.Phone : "_________________");
                templateContent = templateContent.Replace("{{CLIENT_CITY}}", !string.IsNullOrWhiteSpace(client.City) ? client.City : "_________________");
                
                var repName = !string.IsNullOrEmpty(client.RepresentativeName) ? client.RepresentativeName : client.Name;
                var repDoc = !string.IsNullOrEmpty(client.RepresentativeDocument) ? client.RepresentativeDocument : client.Document;
                templateContent = templateContent.Replace("{{CLIENT_REP}}", repName ?? "_________________");
                templateContent = templateContent.Replace("{{CLIENT_REP_DOC}}", repDoc ?? "_________________");
            }
            else 
            {
                // Fallbacks if client is null (shouldn't happen per query)
                templateContent = templateContent.Replace("{{CLIENT_NAME}}", "_________________");
                // ... others ...
            }

            // Vehicle
            if (vehicle != null)
            {
                templateContent = templateContent.Replace("{{VEHICLE_PLATE}}", vehicle.Plate);
                templateContent = templateContent.Replace("{{VEHICLE_BRAND}}", vehicle.Brand);
                templateContent = templateContent.Replace("{{VEHICLE_COLOR}}", vehicle.Color);
                templateContent = templateContent.Replace("{{VEHICLE_MODEL}}", $"{vehicle.Brand} {vehicle.Model} {vehicle.Year}");
            }

            // Rental Details
            templateContent = templateContent.Replace("{{DAILY_RATE}}", rental.DailyRate.ToString("N0", new CultureInfo("es-CO")));
            var days = (rental.EndDate - rental.StartDate).Days;
            if (days < 1) days = 1;
            templateContent = templateContent.Replace("{{DAYS_COUNT}}", days.ToString());
            
            templateContent = templateContent.Replace("{{GUARANTEE_AMOUNT}}", rental.GuaranteeAmount.ToString("N0", new CultureInfo("es-CO")));
            templateContent = templateContent.Replace("{{CONTRACT_CITY}}", rental.ContractCity ?? "_________________");
            
            templateContent = templateContent.Replace("{{DAY}}", DateTime.Now.Day.ToString());
            var monthName = DateTime.Now.ToString("MMMM", new CultureInfo("es-ES"));
            templateContent = templateContent.Replace("{{MONTH}}", monthName);
            templateContent = templateContent.Replace("{{YEAR}}", DateTime.Now.Year.ToString());

            // Save Snapshot
            rental.ContractHtml = templateContent;
            await _context.SaveChangesAsync();

            return templateContent;
        }
    }
}

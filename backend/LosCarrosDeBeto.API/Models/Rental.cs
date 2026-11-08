using System.Text.Json.Serialization;

namespace LosCarrosDeBeto.API.Models
{
    public class Rental
    {
        public int Id { get; set; }
        
        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public int ClientId { get; set; }
        public Client? Client { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        public int InitialMileage { get; set; }
        public int? FinalMileage { get; set; }
        
        public decimal DailyRate { get; set; }
        public decimal? TotalCost { get; set; }
        
        public decimal GuaranteeAmount { get; set; } = 0;
        public string ContractCity { get; set; } = "Becerril";
        public string? ContractHtml { get; set; } // Stored Contract Snapshot
        public string? SignedContractUrl { get; set; } // Uploaded Signed PDF

        public string Status { get; set; } = "Active"; // Active, Completed
    }
}

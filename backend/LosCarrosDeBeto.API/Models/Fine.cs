using System.ComponentModel.DataAnnotations.Schema;

namespace LosCarrosDeBeto.API.Models
{
    public class Fine
    {
        public int Id { get; set; }
        
        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public string ReferenceCode { get; set; } = string.Empty; // SIMIT ID
        public string Reason { get; set; } = string.Empty; // e.g., "C02 - Parking"
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        
        public bool IsPaid { get; set; } = false;
        public DateTime? PaidDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

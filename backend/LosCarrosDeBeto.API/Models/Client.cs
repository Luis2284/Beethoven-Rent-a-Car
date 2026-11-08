namespace LosCarrosDeBeto.API.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Document { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = "Becerril"; // Default

        public string? RepresentativeName { get; set; }
        public string? RepresentativeDocument { get; set; }
        public string? LicenseNumber { get; set; }

        public string? DocumentUrl { get; set; }
        public string? LicenseUrl { get; set; }
    }
}

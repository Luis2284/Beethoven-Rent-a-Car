namespace LosCarrosDeBeto.API.Models
{
    public class NotificationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "Info"; // Info, Warning, Error
        public DateTime Date { get; set; }
        public string? Link { get; set; } // e.g. /rentals/123
    }
}

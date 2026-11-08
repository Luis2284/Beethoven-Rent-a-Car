using System;

namespace LosCarrosDeBeto.API.Models
{
    public class NotificationLog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "Info"; // Info, Warning, Error
        public int? ClientId { get; set; }
        public Client? Client { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

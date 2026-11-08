using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationDto>> GetSystemNotificationsAsync()
        {
            try 
            {
                var notifications = new List<NotificationDto>();
                var today = DateTime.Today;
                var tomorrow = today.AddDays(1);

                // 1. Check Overdue Rentals (Active and EndDate < Today)
                // Note: Ensure EndDate is compared correctly.
                var overdue = await _context.Rentals
                    .Include(r => r.Vehicle)
                    .Include(r => r.Client)
                    .Where(r => r.Status == "Active" && r.EndDate < today)
                    .ToListAsync();

                foreach (var r in overdue)
                {
                    var daysLate = (today - r.EndDate).Days;
                    notifications.Add(new NotificationDto
                    {
                        Title = "Alquiler Vencido",
                        Message = $"El vehículo {r.Vehicle?.Plate ?? "N/A"} (Cliente: {r.Client?.Name ?? "N/A"}) está atrasado por {daysLate} días.",
                        Type = "Error",
                        Date = r.EndDate,
                        Link = "/rentals"
                    });
                }

                // 2. Check Rentals Ending Today (Date range safe)
                var dueToday = await _context.Rentals
                    .Include(r => r.Vehicle)
                    .Include(r => r.Client)
                    .Where(r => r.Status == "Active" && r.EndDate >= today && r.EndDate < tomorrow)
                    .ToListAsync();

                foreach (var r in dueToday)
                {
                    notifications.Add(new NotificationDto
                    {
                        Title = "Entrega Hoy",
                        Message = $"El vehículo {r.Vehicle?.Plate ?? "N/A"} debe ser devuelto hoy por {r.Client?.Name ?? "N/A"}.",
                        Type = "Warning",
                        Date = DateTime.Now,
                        Link = "/rentals"
                    });
                }

                // 3. Vehicles in Maintenance (Info)
                var maintenance = await _context.Vehicles
                    .Where(v => v.Status == "Maintenance")
                    .ToListAsync();
                
                if (maintenance.Any())
                {
                    notifications.Add(new NotificationDto
                    {
                        Title = "Vehículos en Taller",
                        Message = $"{maintenance.Count} vehículos están actualmente en mantenimiento.",
                        Type = "Info",
                        Date = DateTime.Now,
                        Link = "/vehicles"
                    });
                }

                // SAVE TO HISTORY LOG
                foreach (var n in notifications)
                {
                    // Check if exists to avoid duplicates (Basic check by title/date)
                    var exists = await _context.Notifications.AnyAsync(x => x.Title == n.Title && x.CreatedAt.Date == n.Date.Date && x.Message == n.Message);
                    if (!exists) 
                    {
                        _context.Notifications.Add(new NotificationLog
                        {
                            Title = n.Title,
                            Message = n.Message,
                            Type = n.Type,
                            CreatedAt = n.Date,
                            IsRead = false
                        });
                    }
                }
                await _context.SaveChangesAsync();

                return notifications.OrderByDescending(n => n.Type == "Error").ThenBy(n => n.Date).ToList();
            }
            catch (Exception ex)
            {
                // Fallback notification for system error
                return new List<NotificationDto>
                {
                    new NotificationDto 
                    { 
                        Title = "Error de Sistema", 
                        Message = "No se pudieron cargar las alertas: " + ex.Message, 
                        Type = "Error", 
                        Date = DateTime.Now 
                    }
                };
            }
        }
    }
}

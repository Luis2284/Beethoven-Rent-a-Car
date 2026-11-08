using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using LosCarrosDeBeto.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationDbContext _context;

        public NotificationsController(INotificationService notificationService, ApplicationDbContext context)
        {
            _notificationService = notificationService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications()
        {
            var notifications = await _notificationService.GetSystemNotificationsAsync();
            return Ok(notifications);
        }

        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<NotificationLog>>> GetHistory()
        {
             // Simple history fetch (could be paginated)
             var history = await _context.Notifications.OrderByDescending(x => x.CreatedAt).Take(50).ToListAsync();
             return Ok(history);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendManualNotification([FromBody] NotificationLog model)
        {
            model.CreatedAt = DateTime.Now;
            _context.Notifications.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }
    }
}

using LosCarrosDeBeto.API.Models;

namespace LosCarrosDeBeto.API.Services
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetSystemNotificationsAsync();
    }
}

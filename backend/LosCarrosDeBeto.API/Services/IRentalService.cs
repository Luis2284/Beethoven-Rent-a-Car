using LosCarrosDeBeto.API.Models;

namespace LosCarrosDeBeto.API.Services
{
    public interface IRentalService
    {
        Task<IEnumerable<Rental>> GetAllRentalsAsync();
        Task<IEnumerable<Rental>> GetActiveRentalsAsync();
        Task<Rental> CreateRentalAsync(Rental rental);
        Task<Rental?> CompleteRentalAsync(int id, int finalMileage, DateTime returnDate);
        Task<IEnumerable<Rental>> GetRentalHistoryAsync(string plate, DateTime? date);
    }
}

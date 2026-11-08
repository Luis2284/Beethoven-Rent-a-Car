using LosCarrosDeBeto.API.Models;

namespace LosCarrosDeBeto.API.Services
{
    public interface IExpenseService
    {
        Task<IEnumerable<Expense>> GetExpensesByVehicleIdAsync(int vehicleId);
        Task<Expense> CreateExpenseAsync(Expense expense);
        Task<bool> DeleteExpenseAsync(int id);
    }
}

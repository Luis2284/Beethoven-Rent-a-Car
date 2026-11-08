using LosCarrosDeBeto.API.Models;

namespace LosCarrosDeBeto.API.Services
{
    public interface IAdministratorService
    {
        Task<IEnumerable<Administrator>> GetAllAsync();
        Task<Administrator?> GetByIdAsync(int id);
        Task<Administrator> CreateAsync(Administrator administrator);
        Task UpdateAsync(Administrator administrator);
        Task DeleteAsync(int id);
    }
}

using LosCarrosDeBeto.API.Models;

namespace LosCarrosDeBeto.API.Services
{
    public interface IClientService
    {
        Task<IEnumerable<Client>> GetAllClientsAsync();
        Task<Client?> GetClientByIdAsync(int id);
        Task<Client> CreateClientAsync(Client client);
        Task<Client?> UpdateClientAsync(int id, Client client);
        Task<bool> DeleteClientAsync(int id);
    }
}

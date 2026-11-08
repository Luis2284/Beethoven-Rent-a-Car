using System.Threading.Tasks;

namespace LosCarrosDeBeto.API.Services
{
    public interface IContractService
    {
        Task<string> GenerateContractHtmlAsync(int rentalId);
    }
}

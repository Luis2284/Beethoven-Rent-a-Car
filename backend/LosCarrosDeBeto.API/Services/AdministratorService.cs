using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Services
{
    public class AdministratorService : IAdministratorService
    {
        private readonly ApplicationDbContext _context;

        public AdministratorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Administrator>> GetAllAsync()
        {
            return await _context.Administrators
                .Include(a => a.Vehicles)
                .ToListAsync();
        }

        public async Task<Administrator?> GetByIdAsync(int id)
        {
            return await _context.Administrators
                .Include(a => a.Vehicles)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Administrator> CreateAsync(Administrator administrator)
        {
            _context.Administrators.Add(administrator);
            await _context.SaveChangesAsync();
            return administrator;
        }

        public async Task UpdateAsync(Administrator administrator)
        {
            _context.Entry(administrator).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var admin = await _context.Administrators.FindAsync(id);
            if (admin != null)
            {
                _context.Administrators.Remove(admin);
                await _context.SaveChangesAsync();
            }
        }
    }
}

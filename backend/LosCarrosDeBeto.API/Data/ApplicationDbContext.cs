using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<LosCarrosDeBeto.API.Models.Vehicle> Vehicles { get; set; }
        public DbSet<LosCarrosDeBeto.API.Models.Expense> Expenses { get; set; }
        public DbSet<LosCarrosDeBeto.API.Models.Client> Clients { get; set; }
        public DbSet<LosCarrosDeBeto.API.Models.Rental> Rentals { get; set; }
        public DbSet<LosCarrosDeBeto.API.Models.NotificationLog> Notifications { get; set; }
        public DbSet<LosCarrosDeBeto.API.Models.Fine> Fines { get; set; }
        public DbSet<LosCarrosDeBeto.API.Models.Administrator> Administrators { get; set; }
        public DbSet<LosCarrosDeBeto.API.Models.MaintenanceConfig> MaintenanceConfigs { get; set; }
        public DbSet<LosCarrosDeBeto.API.Models.VehicleMaintenance> VehicleMaintenances { get; set; }
    }
}

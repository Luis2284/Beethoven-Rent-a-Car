using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    x.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddOpenApi();

builder.Services.AddDbContext<LosCarrosDeBeto.API.Data.ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<LosCarrosDeBeto.API.Services.IVehicleService, LosCarrosDeBeto.API.Services.VehicleService>();
builder.Services.AddScoped<LosCarrosDeBeto.API.Services.IExpenseService, LosCarrosDeBeto.API.Services.ExpenseService>();
builder.Services.AddScoped<LosCarrosDeBeto.API.Services.IClientService, LosCarrosDeBeto.API.Services.ClientService>();
builder.Services.AddScoped<LosCarrosDeBeto.API.Services.IRentalService, LosCarrosDeBeto.API.Services.RentalService>();
builder.Services.AddScoped<LosCarrosDeBeto.API.Services.INotificationService, LosCarrosDeBeto.API.Services.NotificationService>();
builder.Services.AddScoped<LosCarrosDeBeto.API.Services.IFineService, LosCarrosDeBeto.API.Services.FineService>();
builder.Services.AddScoped<LosCarrosDeBeto.API.Services.IAdministratorService, LosCarrosDeBeto.API.Services.AdministratorService>();
builder.Services.AddScoped<LosCarrosDeBeto.API.Services.IContractService, LosCarrosDeBeto.API.Services.ContractService>();
builder.Services.AddScoped<LosCarrosDeBeto.API.Services.IMaintenanceService, LosCarrosDeBeto.API.Services.MaintenanceService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LosCarrosDeBeto.API.Data.ApplicationDbContext>();
    db.Database.Migrate();
}

app.UseStaticFiles();
app.UseCors("AllowAngular");
app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapControllers();
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

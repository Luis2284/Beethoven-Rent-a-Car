using Microsoft.AspNetCore.Mvc;

namespace LosCarrosDeBeto.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public DatabaseController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("export")]
        public IActionResult ExportDatabase()
        {
            var dbPath = "app.db";
            if (!System.IO.File.Exists(dbPath))
            {
                return NotFound("Base de datos no encontrada.");
            }

            var bytes = System.IO.File.ReadAllBytes(dbPath);
            return File(bytes, "application/x-sqlite3", $"LosCarrosDeBeto_Backup_{DateTime.Now:yyyyMMdd_HHmm}.db");
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportDatabase(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Archivo no válido.");
            }

            // Save as app_restore.db
            // The Electron main process should detect this file on startup, 
            // swap it with app.db, and then start the backend.
            var restorePath = "app_restore.db";
            
            using (var stream = new FileStream(restorePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { message = "Restauración programada. Por favor reinicia la aplicación para aplicar los cambios." });
        }
    }
}

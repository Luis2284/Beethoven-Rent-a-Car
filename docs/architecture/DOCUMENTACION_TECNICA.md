# Documentación Técnica de Arquitectura

## Contexto del Sistema (Nivel 1)

Este diagrama muestra el contexto del sistema para **Los Carros de Beto**, ilustrando cómo el sistema interactúa con los usuarios y servicios externos.

```mermaid
C4Context
  title Contexto del Sistema - Los Carros de Beto

  Person(admin, "Administrador", "Gestiona vehículos, alquileres y contratos")
  Person(client, "Cliente", "Alquila vehículos y visualiza contratos activos")

  System(system, "Los Carros de Beto", "Sistema de Gestión de Alquiler de Vehículos")

  System_Ext(simit, "API SIMIT", "Verifica licencias de conducción y multas")
  System_Ext(gemini, "API Google Gemini", "Provee análisis y asistencia con IA")

  Rel(admin, system, "Gestiona flota y alquileres")
  Rel(client, system, "Visualiza estado y contratos")
  
  Rel(system, simit, "Verifica licencias usando", "HTTP/REST")
  Rel(system, gemini, "Genera insights usando", "HTTP/REST")
```

## Contenedores (Nivel 2)

Este diagrama detalla los contenedores de alto nivel dentro del sistema **Los Carros de Beto**, mostrando las elecciones tecnológicas y responsabilidades.

```mermaid
C4Container
  title Diagrama de Contenedores - Los Carros de Beto

  Person(user, "Usuario", "Administrador o Cliente")

  System_Ext(simit, "API SIMIT", "Autoridad de tránsito externa")
  System_Ext(gemini, "API Google Gemini", "Servicios de IA")

  Container_Boundary(c1, "Plataforma Los Carros de Beto") {
    Container(spa, "Single Page Application", "Angular 21", "Provee la interfaz web para administración y seguimiento")
    Container(api, "API Backend", ".NET 10", "Maneja lógica de negocio, contratos e integraciones")
    ContainerDb(db, "Base de Datos", "SQL Server", "Almacena vehículos, alquileres, clientes y contratos")
  }

  Rel(user, spa, "Usa", "HTTPS")
  Rel(spa, api, "Llamadas API", "JSON/HTTPS")
  
  Rel(api, db, "Lee/Escribe", "EF Core / SQL")
  Rel(api, simit, "Consulta estado", "HTTP/REST")
  Rel(api, gemini, "Solicita análisis IA", "HTTP/RPC")
```

## Decisiones de Arquitectura y Diseño

El sistema ha sido diseñado bajo una arquitectura de **N-Capas Modernas**, separando claramente el Frontend del Backend para permitir escalabilidad independiente y una mejor experiencia de usuario.

### Stack Tecnológico

| Componente | Tecnología | Versión | Justificación |
|------------|------------|---------|---------------|
| **Frontend** | Angular | 21 | Framework robusto, tipado estático con TypeScript, ideal para aplicaciones empresariales y SPA (Single Page Applications) de alto rendimiento. |
| **Backend** | .NET | 10 | Plataforma unificada de alto rendimiento, multiplataforma y con soporte nativo para inyección de dependencias y APIs RESTful seguras. |
| **Base de Datos** | SQL Server | Latest | Sistema de gestión de base de datos relacional robusto, ideal para mantener la integridad de transacciones financieras y contratos. |

### Patrones y Estándares

*   **Repository Pattern**: Utilizado en el backend para abstraer la lógica de acceso a datos.
*   **DTOs (Data Transfer Objects)**: Para desacoplar los modelos de base de datos de los contratos de API.
*   **Inyección de Dependencias**: Para promover un código modular y testeable.
*   **Diseño Visual**: Implementación de **Glassmorphism** y principios de diseño moderno en el Frontend para una experiencia de usuario premium.

### Integraciones Externas

*   **SIMIT**: Integración directa para validación de cumplimiento legal de conductores en tiempo real.
*   **Google Gemini AI**: Utilizado para análisis predictivo y asistencia inteligente en la toma de decisiones.

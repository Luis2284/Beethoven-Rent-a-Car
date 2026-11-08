-- =====================================================
-- EVIDENCIA GA6-220501096-AA2-EV03
-- Proyecto: Beethoven Rent a Car
-- Script de base de datos del proyecto
-- =====================================================

PRAGMA foreign_keys = ON;

-- =====================================================
-- 1. SENTENCIAS PARA LA CREACIÓN DE TABLAS
-- =====================================================


-- TABLA ADMINISTRATORS
CREATE TABLE IF NOT EXISTS Administrators (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Document TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Email TEXT NOT NULL,
    Address TEXT NOT NULL,
    City TEXT NOT NULL,
    LicenseNumber TEXT NOT NULL,
    DocumentUrl TEXT
);


-- TABLA CLIENTS
CREATE TABLE IF NOT EXISTS Clients (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Document TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Email TEXT NOT NULL,
    Address TEXT NOT NULL,
    City TEXT NOT NULL,
    RepresentativeName TEXT,
    RepresentativeDocument TEXT,
    LicenseNumber TEXT,
    DocumentUrl TEXT,
    LicenseUrl TEXT
);


-- TABLA VEHICLES
CREATE TABLE IF NOT EXISTS Vehicles (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Plate TEXT NOT NULL,
    Color TEXT NOT NULL,
    Brand TEXT NOT NULL,
    Model TEXT NOT NULL,
    Year INTEGER NOT NULL,
    Description TEXT NOT NULL,
    ImageUrl TEXT,
    Status TEXT NOT NULL,
    CurrentMileage INTEGER NOT NULL,
    AdministratorId INTEGER,

    FOREIGN KEY (AdministratorId)
        REFERENCES Administrators(Id)
);


-- TABLA RENTALS
CREATE TABLE IF NOT EXISTS Rentals (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    VehicleId INTEGER NOT NULL,
    ClientId INTEGER NOT NULL,
    StartDate TEXT NOT NULL,
    EndDate TEXT NOT NULL,
    InitialMileage INTEGER NOT NULL,
    FinalMileage INTEGER,
    DailyRate TEXT NOT NULL,
    TotalCost TEXT,
    GuaranteeAmount TEXT NOT NULL,
    ContractCity TEXT NOT NULL,
    ContractHtml TEXT,
    SignedContractUrl TEXT,
    Status TEXT NOT NULL,

    FOREIGN KEY (VehicleId)
        REFERENCES Vehicles(Id)
        ON DELETE CASCADE,

    FOREIGN KEY (ClientId)
        REFERENCES Clients(Id)
        ON DELETE CASCADE
);


-- =====================================================
-- 2. SENTENCIAS PARA INSERTAR DATOS
-- =====================================================


-- INSERTAR CLIENTE
INSERT INTO Clients (
    Name,
    Document,
    Phone,
    Email,
    Address,
    City
)
VALUES (
    'Carlos Martinez',
    '1065001234',
    '3001234567',
    'carlos@email.com',
    'Calle 10 # 15-20',
    'Becerril'
);


-- CLIENTES ADICIONALES PARA LA EVIDENCIA
BEGIN TRANSACTION;

INSERT INTO Clients (
    Name,
    Document,
    Phone,
    Email,
    Address,
    City
)
VALUES
('Laura Mendoza', '1065002001', '3002345601', 'laura.mendoza@example.com', 'Calle 5 # 8-15', 'Becerril'),
('Andres Rodriguez', '1065002002', '3013456702', 'andres.rodriguez@example.com', 'Carrera 7 # 12-30', 'Valledupar'),
('Maria Torres', '1065002003', '3024567803', 'maria.torres@example.com', 'Calle 9 # 18-22', 'Becerril'),
('Jose Ramirez', '1065002004', '3035678904', 'jose.ramirez@example.com', 'Carrera 10 # 6-40', 'Agustin Codazzi'),
('Daniela Perez', '1065002005', '3046789005', 'daniela.perez@example.com', 'Calle 14 # 11-25', 'La Jagua de Ibirico'),
('Miguel Herrera', '1065002006', '3057890106', 'miguel.herrera@example.com', 'Carrera 4 # 20-10', 'Becerril'),
('Sofia Castro', '1065002007', '3108901207', 'sofia.castro@example.com', 'Calle 8 # 16-35', 'Valledupar'),
('Juan Garcia', '1065002008', '3119012308', 'juan.garcia@example.com', 'Carrera 12 # 9-18', 'Becerril'),
('Camila Martinez', '1065002009', '3120123409', 'camila.martinez@example.com', 'Calle 6 # 13-45', 'La Paz'),
('Sebastian Lopez', '1065002010', '3131234510', 'sebastian.lopez@example.com', 'Carrera 8 # 15-28', 'Becerril');

COMMIT;


-- INSERTAR VEHÍCULO
INSERT INTO Vehicles (
    Plate,
    Color,
    Brand,
    Model,
    Year,
    Description,
    Status,
    CurrentMileage
)
VALUES (
    'ABC123',
    'Blanco',
    'Toyota',
    'Corolla',
    2023,
    'Vehiculo disponible para alquiler',
    'Disponible',
    25000
);


-- VEHÍCULOS ADICIONALES PARA LA EVIDENCIA
BEGIN TRANSACTION;

INSERT INTO Vehicles (
    Plate,
    Color,
    Brand,
    Model,
    Year,
    Description,
    Status,
    CurrentMileage
)
VALUES
('DEF456', 'Gris', 'Chevrolet', 'Onix', 2024, 'Vehiculo compacto para alquiler', 'Disponible', 18000),
('GHI789', 'Negro', 'Renault', 'Logan', 2023, 'Vehiculo sedan para alquiler', 'Disponible', 22000),
('JKL321', 'Rojo', 'Kia', 'Rio', 2024, 'Vehiculo economico para alquiler', 'Disponible', 15000),
('MNO654', 'Plata', 'Mazda', 'Mazda 2', 2023, 'Vehiculo automatico para alquiler', 'Disponible', 27000),
('PQR987', 'Blanco', 'Nissan', 'Versa', 2022, 'Vehiculo sedan amplio para alquiler', 'Disponible', 32000),
('STU741', 'Azul', 'Hyundai', 'Accent', 2023, 'Vehiculo familiar para alquiler', 'Disponible', 24000),
('VWX852', 'Gris', 'Volkswagen', 'Virtus', 2024, 'Vehiculo confortable para alquiler', 'Disponible', 12000),
('YZA963', 'Blanco', 'Suzuki', 'Swift', 2023, 'Vehiculo compacto y economico', 'Disponible', 19500),
('BCD159', 'Negro', 'Toyota', 'Yaris', 2024, 'Vehiculo moderno para alquiler', 'Disponible', 10500),
('EFG357', 'Rojo', 'Chevrolet', 'Tracker', 2023, 'Vehiculo SUV para alquiler', 'Disponible', 21000);

COMMIT;


-- INSERTAR ALQUILER
INSERT INTO Rentals (
    VehicleId,
    ClientId,
    StartDate,
    EndDate,
    InitialMileage,
    DailyRate,
    GuaranteeAmount,
    ContractCity,
    Status
)
VALUES (
    (SELECT Id FROM Vehicles
     WHERE Plate = 'ABC123'
     ORDER BY Id DESC LIMIT 1),

    (SELECT Id FROM Clients
     WHERE Document = '1065001234'
     ORDER BY Id DESC LIMIT 1),

    '2026-08-25',
    '2026-08-28',
    25000,
    '150000',
    '300000',
    'Becerril',
    'Activo'
);


-- ALQUILERES ADICIONALES PARA LA EVIDENCIA
BEGIN TRANSACTION;

INSERT INTO Rentals (
    VehicleId,
    ClientId,
    StartDate,
    EndDate,
    InitialMileage,
    DailyRate,
    GuaranteeAmount,
    ContractCity,
    Status
)
VALUES
(
    (SELECT Id FROM Vehicles WHERE Plate = 'DEF456' ORDER BY Id DESC LIMIT 1),
    (SELECT Id FROM Clients WHERE Document = '1065002001' ORDER BY Id DESC LIMIT 1),
    '2026-09-05',
    '2026-09-08',
    18000,
    140000,
    300000,
    'Becerril',
    'Activo'
),
(
    (SELECT Id FROM Vehicles WHERE Plate = 'GHI789' ORDER BY Id DESC LIMIT 1),
    (SELECT Id FROM Clients WHERE Document = '1065002002' ORDER BY Id DESC LIMIT 1),
    '2026-09-06',
    '2026-09-10',
    22000,
    130000,
    300000,
    'Valledupar',
    'Activo'
),
(
    (SELECT Id FROM Vehicles WHERE Plate = 'JKL321' ORDER BY Id DESC LIMIT 1),
    (SELECT Id FROM Clients WHERE Document = '1065002003' ORDER BY Id DESC LIMIT 1),
    '2026-09-07',
    '2026-09-09',
    15000,
    135000,
    300000,
    'Becerril',
    'Activo'
),
(
    (SELECT Id FROM Vehicles WHERE Plate = 'MNO654' ORDER BY Id DESC LIMIT 1),
    (SELECT Id FROM Clients WHERE Document = '1065002004' ORDER BY Id DESC LIMIT 1),
    '2026-09-08',
    '2026-09-12',
    27000,
    150000,
    350000,
    'Agustin Codazzi',
    'Activo'
),
(
    (SELECT Id FROM Vehicles WHERE Plate = 'PQR987' ORDER BY Id DESC LIMIT 1),
    (SELECT Id FROM Clients WHERE Document = '1065002005' ORDER BY Id DESC LIMIT 1),
    '2026-09-09',
    '2026-09-13',
    32000,
    145000,
    300000,
    'La Jagua de Ibirico',
    'Activo'
),
(
    (SELECT Id FROM Vehicles WHERE Plate = 'STU741' ORDER BY Id DESC LIMIT 1),
    (SELECT Id FROM Clients WHERE Document = '1065002006' ORDER BY Id DESC LIMIT 1),
    '2026-09-10',
    '2026-09-14',
    24000,
    140000,
    300000,
    'Becerril',
    'Activo'
),
(
    (SELECT Id FROM Vehicles WHERE Plate = 'VWX852' ORDER BY Id DESC LIMIT 1),
    (SELECT Id FROM Clients WHERE Document = '1065002007' ORDER BY Id DESC LIMIT 1),
    '2026-09-11',
    '2026-09-15',
    12000,
    160000,
    350000,
    'Valledupar',
    'Activo'
),
(
    (SELECT Id FROM Vehicles WHERE Plate = 'YZA963' ORDER BY Id DESC LIMIT 1),
    (SELECT Id FROM Clients WHERE Document = '1065002008' ORDER BY Id DESC LIMIT 1),
    '2026-09-12',
    '2026-09-16',
    19500,
    125000,
    300000,
    'Becerril',
    'Activo'
);

COMMIT;


-- =====================================================
-- 3. SENTENCIAS PARA REALIZAR CONSULTAS
-- =====================================================


-- CONSULTAR TODOS LOS CLIENTES
SELECT * FROM Clients;


-- CONSULTAR TODOS LOS VEHÍCULOS
SELECT * FROM Vehicles;


-- CONSULTAR TODOS LOS ALQUILERES
SELECT * FROM Rentals;


-- CONSULTA DE ALQUILER CON CLIENTE Y VEHÍCULO
SELECT
    Rentals.Id,
    Clients.Name AS Cliente,
    Vehicles.Plate AS Placa,
    Vehicles.Brand AS Marca,
    Vehicles.Model AS Modelo,
    Rentals.StartDate AS FechaInicio,
    Rentals.EndDate AS FechaFin,
    Rentals.Status AS Estado
FROM Rentals
INNER JOIN Clients
    ON Rentals.ClientId = Clients.Id
INNER JOIN Vehicles
    ON Rentals.VehicleId = Vehicles.Id
ORDER BY Rentals.Id;
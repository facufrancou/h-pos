-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS punto_de_venta;
USE punto_de_venta;

-- Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    precio_alternativo DECIMAL(10, 2), -- Precio alternativo (por ejemplo, delivery)
    puntos_suma INT DEFAULT 0, -- Puntos que este producto acumula al cliente
    cantidad_stock INT NOT NULL, -- Cantidad en stock
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    puntos_acumulados INT DEFAULT 0, -- Puntos acumulados por el cliente
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: turnos
CREATE TABLE IF NOT EXISTS turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL, -- Usuario que inicia el turno (nombre o identificador)
    fondo_inicial DECIMAL(10, 2) NOT NULL, -- Dinero en caja al inicio del turno
    fondo_final DECIMAL(10, 2), -- Dinero en caja al cierre del turno
    estado ENUM('abierto', 'cerrado') DEFAULT 'abierto', -- Estado del turno
    inicio DATETIME NOT NULL, -- Fecha y hora de inicio del turno
    cierre DATETIME -- Fecha y hora de cierre del turno
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Se guardará encriptado
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modificar la tabla turnos para relacionarla con usuarios
ALTER TABLE turnos
ADD COLUMN usuario_id INT,
ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;

-- Tabla: metodos_pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- Nombre del método de pago
    descripcion TEXT, -- Descripción opcional
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT, -- Cliente que realizó la compra
    metodo_pago_id INT, -- Relación con la tabla de métodos de pago
    turno_id INT, -- Relación con la tabla de turnos
    fecha DATETIME NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    puntos_ganados INT DEFAULT 0, -- Puntos ganados en esta venta
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id),
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE SET NULL
);

-- Tabla: productos_en_ventas
CREATE TABLE IF NOT EXISTS productos_en_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT, -- Producto relacionado
    cantidad INT NOT NULL, -- Cantidad de producto vendido
    precio_unitario DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL, -- Total de este producto en la venta
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
);

-- Tabla: fondos
CREATE TABLE IF NOT EXISTS fondos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turno_id INT, -- Relación con la tabla de turnos
    fecha DATETIME NOT NULL,
    descripcion TEXT, -- Motivo o descripción del fondo
    monto DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE SET NULL
);

-- Tabla: retiros
CREATE TABLE IF NOT EXISTS retiros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turno_id INT, -- Relación con la tabla de turnos
    fecha DATETIME NOT NULL,
    descripcion TEXT, -- Motivo o descripción del retiro
    monto DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE SET NULL
);

-- Tabla: cierres
CREATE TABLE IF NOT EXISTS cierres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(1) NOT NULL, -- 'X' para parcial, 'Z' para total
    turno_id INT, -- Relación con la tabla de turnos
    fecha DATETIME NOT NULL,
    total_ventas DECIMAL(10, 2) NOT NULL,
    total_retiros DECIMAL(10, 2) NOT NULL,
    efectivo_caja DECIMAL(10, 2) NOT NULL, -- Dinero efectivo disponible en caja
    total_final DECIMAL(10, 2) NOT NULL, -- Total después del cierre
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE SET NULL
);

-- Insertar métodos de pago iniciales
INSERT INTO metodos_pago (nombre, descripcion) VALUES
('Efectivo', 'Pago en efectivo'),
('Transferencia', 'Pago mediante transferencia bancaria'),
('Tarjeta de Débito', 'Pago con tarjeta de débito'),
('Tarjeta de Crédito', 'Pago con tarjeta de crédito'),
('App Delivery', 'Pago a través de la aplicación de delivery');

-- Modificar la tabla turnos para relacionarla con usuarios
ALTER TABLE turnos
ADD COLUMN usuario_id INT,
ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;
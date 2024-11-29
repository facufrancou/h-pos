-- Crear la base de datos
CREATE DATABASE punto_de_venta;
USE punto_de_venta;

-- Tabla: productos
CREATE TABLE productos (
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
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    puntos_acumulados INT DEFAULT 0, -- Puntos acumulados por el cliente
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: metodos_pago (nuevo)
CREATE TABLE metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- Nombre del método de pago
    descripcion TEXT, -- Descripción opcional
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT, -- Cliente que realizó la compra
    metodo_pago_id INT, -- Relación con la tabla de métodos de pago
    fecha DATETIME NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    puntos_ganados INT DEFAULT 0, -- Puntos ganados en esta venta
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id) -- Relación con métodos de pago
);

-- Tabla: productos_en_ventas (relación N:M entre productos y ventas)
CREATE TABLE productos_en_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL, -- Cantidad de producto vendido
    precio_unitario DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL, -- Total de este producto en la venta
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla: fondos (para registrar ingresos de efectivo iniciales)
CREATE TABLE fondos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    descripcion TEXT, -- Motivo o descripción del fondo
    monto DECIMAL(10, 2) NOT NULL
);

-- Tabla: retiros (retiros de caja)
CREATE TABLE retiros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    descripcion TEXT, -- Motivo o descripción del retiro
    monto DECIMAL(10, 2) NOT NULL
);

-- Tabla: cierres (cierres de turno o totales)
CREATE TABLE cierres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(1) NOT NULL, -- 'X' para parcial, 'Z' para total
    fecha DATETIME NOT NULL,
    total_ventas DECIMAL(10, 2) NOT NULL,
    total_retiros DECIMAL(10, 2) NOT NULL,
    efectivo_caja DECIMAL(10, 2) NOT NULL, -- Dinero efectivo disponible en caja
    total_final DECIMAL(10, 2) NOT NULL -- Total después del cierre
);

-- Tabla: comandas (para manejo de órdenes)
CREATE TABLE comandas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL, -- Relación con la venta
    estado ENUM('pendiente', 'aceptado', 'finalizado') NOT NULL DEFAULT 'pendiente', -- Estado de la comanda
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la comanda
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Última actualización
    FOREIGN KEY (venta_id) REFERENCES ventas(id)
);

-- Tabla: historial_puntos (registro de puntos ganados o canjeados)
CREATE TABLE historial_puntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    puntos INT NOT NULL, -- Puntos ganados o canjeados
    tipo ENUM('ganado', 'canjeado') NOT NULL, -- Operación realizada
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Crear índices para optimizar consultas (opcional)
CREATE INDEX idx_producto_nombre ON productos (nombre);
CREATE INDEX idx_cliente_email ON clientes (email);
CREATE INDEX idx_fecha_ventas ON ventas (fecha);
CREATE INDEX idx_estado_comandas ON comandas (estado);


-- Insertar métodos de pago iniciales
INSERT INTO metodos_pago (nombre, descripcion) VALUES
('Efectivo', 'Pago en efectivo'),
('Transferencia', 'Pago mediante transferencia bancaria'),
('Tarjeta de Débito', 'Pago con tarjeta de débito'),
('Tarjeta de Crédito', 'Pago con tarjeta de crédito'),
('App Delivery', 'Pago a través de la aplicación de delivery');

-- Insertar datos en productos
INSERT INTO productos (nombre, descripcion, precio, precio_alternativo, puntos_suma, cantidad_stock)
VALUES
('Helado de Vainilla', 'Delicioso helado cremoso de vainilla.', 100.00, 90.00, 10, 50),
('Helado de Fresa', 'Helado hecho con fresas frescas.', 110.75, 100.00, 12, 30),
('Helado de Chocolate', 'Helado cremoso de chocolate oscuro.', 120.00, 110.00, 15, 20),
('Helado de Mango', 'Helado tropical de mango natural.', 130.00, 120.00, 20, 25);

-- Insertar datos en clientes
INSERT INTO clientes (nombre, apellido, direccion, email, telefono, puntos_acumulados)
VALUES
('Juan', 'Pérez', 'Calle Falsa 123', 'juan.perez@email.com', '123456789', 20),
('María', 'Gómez', 'Avenida Siempre Viva 742', 'maria.gomez@email.com', '987654321', 50),
('Carlos', 'López', 'Boulevard de los Sueños 456', 'carlos.lopez@email.com', '456789123', 30),
('Ana', 'Ramírez', 'Calle Luna 789', 'ana.ramirez@email.com', '789123456', 60);

-- Insertar datos en metodos_pago
INSERT INTO metodos_pago (nombre, descripcion)
VALUES
('Efectivo', 'Pago en efectivo'),
('Transferencia', 'Pago mediante transferencia bancaria'),
('Tarjeta de Débito', 'Pago con tarjeta de débito'),
('Tarjeta de Crédito', 'Pago con tarjeta de crédito'),
('App Delivery', 'Pago a través de la aplicación de delivery');

-- Insertar datos en ventas
INSERT INTO ventas (cliente_id, metodo_pago_id, fecha, total, puntos_ganados)
VALUES
(1, 1, '2024-11-29 10:00:00', 200.00, 20),
(2, 2, '2024-11-29 12:30:00', 150.00, 15),
(3, 3, '2024-11-29 14:00:00', 300.00, 30),
(4, 4, '2024-11-29 16:15:00', 400.00, 40);

-- Insertar datos en productos_en_ventas
INSERT INTO productos_en_ventas (venta_id, producto_id, cantidad, precio_unitario, total)
VALUES
(1, 1, 2, 100.00, 200.00),
(2, 2, 1, 110.75, 110.75),
(3, 3, 3, 120.00, 360.00),
(4, 4, 4, 130.00, 520.00);

-- Insertar datos en fondos
INSERT INTO fondos (fecha, descripcion, monto)
VALUES
('2024-11-29 09:00:00', 'Fondo inicial del turno', 5000.00),
('2024-11-29 14:00:00', 'Aporte adicional para cambio', 2000.00);

-- Insertar datos en retiros
INSERT INTO retiros (fecha, descripcion, monto)
VALUES
('2024-11-29 11:00:00', 'Pago de proveedor', 1000.00),
('2024-11-29 15:30:00', 'Retiro para caja chica', 500.00);

-- Insertar datos en cierres
INSERT INTO cierres (tipo, fecha, total_ventas, total_retiros, efectivo_caja, total_final)
VALUES
('X', '2024-11-29 12:00:00', 350.75, 1000.00, 4500.00, 3000.75),
('Z', '2024-11-29 18:00:00', 900.75, 1500.00, 5000.00, 3500.75);

-- Insertar datos en comandas
INSERT INTO comandas (venta_id, estado)
VALUES
(1, 'pendiente'),
(2, 'aceptado'),
(3, 'finalizado'),
(4, 'pendiente');

-- Insertar datos en historial_puntos
INSERT INTO historial_puntos (cliente_id, puntos, tipo, fecha)
VALUES
(1, 20, 'ganado', '2024-11-29 10:00:00'),
(2, 15, 'ganado', '2024-11-29 12:30:00'),
(3, 30, 'ganado', '2024-11-29 14:00:00'),
(4, 40, 'ganado', '2024-11-29 16:15:00');
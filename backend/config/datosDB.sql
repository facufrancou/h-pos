-- Insertar datos en productos
INSERT INTO productos (nombre, descripcion, precio, precio_alternativo, cantidad_stock, puntos_suma) VALUES
('1/4 a 1000$', '', 1000, 0, 0, 0),
('BALDE 5kg', '', 0, 0, 0, 0),
('CHAMPANG', '', 0, 0, 0, 0),
('PALITO helado', '', 0, 0, 0, 0),
('pote de 1/2 vacío', '', 500, 0, 0, 0),
('pote de 1/4 vacío', '', 200, 0, 0, 0),
('promo café', '', 0, 0, 0, 0),
('1 café + 1 alfajor', '', 0, 0, 0, 0),
('KILO', '', 9000, 0, 0, 0),
('1/2 KILO', '', 5000, 0, 0, 0),
('1/4 KILO', '', 2900, 0, 0, 0),
('CUCURUCHO 1', '', 2500, 0, 0, 0),
('CUCURUCHO 2 BOCHAS', '', 2700, 0, 0, 0),
('vasito 1 bocha', '', 2200, 0, 0, 0),
('vasito 2 bocha', '', 2400, 0, 0, 0),
('MILK SHAKE', '', 2700, 0, 0, 0),
('SUIZO X 8', '', 7500, 0, 0, 0),
('ESCOCES X 8', '', 8000, 0, 0, 0),
('MIXTO X 8', '', 6500, 0, 0, 0),
('BLDE DE 3L', '', 8500, 0, 0, 0),
('DELIVERY x km', '', 100, 0, 0, 0),
('VASITO X 2u', '', 500, 0, 0, 0),
('CUCURUCHO X 3', '', 0, 0, 0, 0),
('PANADERIA', '', 0, 0, 0, 0),
('1 CHURRO, 1 M.LUNA', '', 500, 0, 0, 0),
('6 CHURROS', '', 2800, 0, 0, 0),
('12 CHURROS', '', 5400, 0, 0, 0),
('POCHOCLO IND', '', 0, 0, 0, 0),
('POCHOCLO Fliar', '', 0, 0, 0, 0),
('CHIPA 4 CHIPAS', '', 0, 0, 0, 0),
('6 MEDIALUNAS', '', 0, 0, 0, 0),
('12 MEDIALUNAS', '', 0, 0, 0, 0),
('TRADICIONAL', 'kg tradicional o limón', 0, 1300, 0, 0),
('1/2 TRADICIONAL', '', 0, 0, 0, 0),
('PROMO 1/4 pya', '', 0, 0, 0, 0),
('TOPPIG', '', 500, 0, 0, 0),
('exp o américa', '', 1300, 0, 0, 0),
('2 exp o ameri', '', 2300, 0, 0, 0),
('latte o capucc', '', 1800, 0, 0, 0),
('2 latte o capucc', '', 3200, 0, 0, 0),
('expre + mediaL', '', 1700, 0, 0, 0),
('latte + media L', '', 2100, 0, 0, 0),
('SUBMARINO', '', 1800, 0, 0, 0),
('PIZZAS GRANDE MUZZA', '', 8800, 0, 0, 0),
('1 PANCHO', '', 2000, 0, 0, 0),
('2 PANCHOS', '', 3500, 0, 0, 0),
('pancho + gaseosa', '', 3500, 0, 0, 0),
('1 EMPANADA', '', 1100, 0, 0, 0),
('3 EMPANADAS', '', 3250, 0, 0, 0),
('X6 EMPANADAS', '', 6100, 0, 0, 0),
('X12 EMPANADAS', '', 11800, 0, 0, 0),
('gaseosa 500ML', '', 1800, 0, 0, 0);

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
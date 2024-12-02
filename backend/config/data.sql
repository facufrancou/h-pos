-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: punto_de_venta
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `cierres`
--

LOCK TABLES `CIERRES` WRITE;

/*!40000 ALTER TABLE `cierres` DISABLE KEYS */;

INSERT INTO `CIERRES` VALUES (
    51,
    'X',
    NULL,
    '2024-12-02 19:26:45',
    3600.00,
    10000.00,
    20000.00,
    11800.00
),
(
    52,
    'X',
    NULL,
    '2024-12-02 19:52:35',
    5600.00,
    100.00,
    100.00,
    1800.00
),
(
    53,
    'X',
    NULL,
    '2024-12-02 19:52:52',
    5600.00,
    100.00,
    100.00,
    1800.00
),
(
    54,
    'X',
    NULL,
    '2024-12-02 19:53:36',
    5600.00,
    100.00,
    100.00,
    1800.00
),
(
    55,
    'X',
    NULL,
    '2024-12-02 20:11:31',
    5600.00,
    100.00,
    4100.00,
    5800.00
),
(
    56,
    'X',
    NULL,
    '2024-12-02 20:18:53',
    5600.00,
    100.00,
    7100.00,
    8800.00
),
(
    57,
    'X',
    NULL,
    '2024-12-02 20:19:23',
    5600.00,
    100.00,
    7100.00,
    8800.00
),
(
    58,
    'X',
    NULL,
    '2024-12-02 20:19:39',
    5600.00,
    100.00,
    7100.00,
    8800.00
),
(
    59,
    'X',
    NULL,
    '2024-12-02 22:30:53',
    5600.00,
    3100.00,
    20100.00,
    18800.00
),
(
    60,
    'X',
    NULL,
    '2024-12-02 22:31:22',
    5600.00,
    25322.00,
    22322.00,
    -1200.00
),
(
    61,
    'X',
    NULL,
    '2024-12-02 22:32:18',
    5600.00,
    25322.00,
    22322.00,
    -1200.00
),
(
    62,
    'X',
    NULL,
    '2024-12-02 22:32:28',
    5600.00,
    25322.00,
    22322.00,
    -1200.00
),
(
    63,
    'X',
    NULL,
    '2024-12-02 22:34:11',
    5600.00,
    25322.00,
    22322.00,
    -1200.00
),
(
    64,
    'X',
    NULL,
    '2024-12-02 22:35:24',
    5600.00,
    25322.00,
    22322.00,
    -1200.00
),
(
    65,
    'X',
    NULL,
    '2024-12-02 22:36:27',
    5600.00,
    25322.00,
    22322.00,
    -1200.00
),
(
    66,
    'X',
    NULL,
    '2024-12-02 22:38:38',
    0.00,
    0.00,
    0.00,
    0.00
),
(
    67,
    'X',
    NULL,
    '2024-12-02 22:40:11',
    15400.00,
    5000.00,
    10000.00,
    16800.00
),
(
    68,
    'X',
    NULL,
    '2024-12-02 22:40:27',
    15400.00,
    5000.00,
    10000.00,
    16800.00
),
(
    69,
    'X',
    NULL,
    '2024-12-02 22:41:37',
    15400.00,
    5000.00,
    10000.00,
    16800.00
),
(
    70,
    'X',
    NULL,
    '2024-12-02 22:42:08',
    15400.00,
    5000.00,
    26800.00,
    33600.00
),
(
    71,
    'X',
    NULL,
    '2024-12-02 22:43:32',
    15400.00,
    21800.00,
    26800.00,
    16800.00
);

/*!40000 ALTER TABLE `cierres` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `CLIENTES` WRITE;

/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;

INSERT INTO `CLIENTES` VALUES (
    2,
    'María',
    'Gómez',
    'Avenida Siempre Viva 742',
    'maria.gomez@email.com',
    '987654321',
    130,
    '2024-12-01 17:34:47'
),
(
    3,
    'Carlos',
    'López',
    'Boulevard de los Sueños 456',
    'carlos.lopez@email.com',
    '456789123',
    90,
    '2024-12-01 17:34:47'
),
(
    4,
    'Ana',
    'Ramírez',
    'Calle Luna 789',
    'ana.ramirez@email.com',
    '789123456',
    120,
    '2024-12-01 17:34:47'
),
(
    5,
    'Facundo Emmanuel',
    'FRANCOU',
    'AV. Almafuerte 233',
    'francou.facundo@gmail.com',
    '03442467614',
    30,
    '2024-12-02 15:09:58'
);

/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `fondos`
--

LOCK TABLES `FONDOS` WRITE;

/*!40000 ALTER TABLE `fondos` DISABLE KEYS */;

INSERT INTO `FONDOS` VALUES (
    16,
    19,
    '2024-12-02 22:38:55',
    'Fondo inicial al abrir caja',
    10000.00
),
(
    17,
    20,
    '2024-12-02 22:42:05',
    'Fondo inicial al abrir caja',
    16800.00
);

/*!40000 ALTER TABLE `fondos` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `METODOS_PAGO` WRITE;

/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;

INSERT INTO `METODOS_PAGO` VALUES (
    1,
    'Efectivo',
    'Pago en efectivo',
    '2024-12-01 17:34:22'
),
(
    2,
    'Transferencia',
    'Pago mediante transferencia bancaria',
    '2024-12-01 17:34:22'
),
(
    3,
    'Tarjeta de Débito',
    'Pago con tarjeta de débito',
    '2024-12-01 17:34:22'
),
(
    4,
    'Tarjeta de Crédito',
    'Pago con tarjeta de crédito',
    '2024-12-01 17:34:22'
),
(
    5,
    'App Delivery',
    'Pago a través de la aplicación de delivery',
    '2024-12-01 17:34:22'
);

/*!40000 ALTER TABLE `metodos_pago` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `productos`
--

LOCK TABLES `PRODUCTOS` WRITE;

/*!40000 ALTER TABLE `productos` DISABLE KEYS */;

INSERT INTO `PRODUCTOS` VALUES (
    1,
    '1/4 a 1000$',
    'helado cuarto',
    1000.00,
    0.00,
    30,
    0,
    '2024-12-01 18:04:50'
),
(
    162,
    'BALDE 5kg',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    163,
    'CHAMPANG',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    164,
    'PALITO helado',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    165,
    'pote de 1/2 vacío',
    '',
    500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    166,
    'pote de 1/4 vacío',
    '',
    200.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    167,
    'promo café',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    168,
    '1 café + 1 alfajor',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    169,
    'KILO',
    '',
    9000.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    170,
    '1/2 KILO',
    '',
    5000.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    171,
    '1/4 KILO',
    '',
    2900.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    172,
    'CUCURUCHO 1',
    '',
    2500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    173,
    'CUCURUCHO 2 BOCHAS',
    '',
    2700.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    174,
    'vasito 1 bocha',
    '',
    2200.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    175,
    'vasito 2 bocha',
    '',
    2400.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    176,
    'MILK SHAKE',
    '',
    2700.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    177,
    'SUIZO X 8',
    '',
    7500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    178,
    'ESCOCES X 8',
    '',
    8000.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    179,
    'MIXTO X 8',
    '',
    6500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    180,
    'BLDE DE 3L',
    '',
    8500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    181,
    'DELIVERY x km',
    '',
    100.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    182,
    'VASITO X 2u',
    '',
    500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    183,
    'CUCURUCHO X 3',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    184,
    'PANADERIA',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    185,
    '1 CHURRO, 1 M.LUNA',
    '',
    500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    186,
    '6 CHURROS',
    '',
    2800.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    187,
    '12 CHURROS',
    '',
    5400.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    188,
    'POCHOCLO IND',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    189,
    'POCHOCLO Fliar',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    190,
    'CHIPA 4 CHIPAS',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    191,
    '6 MEDIALUNAS',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    192,
    '12 MEDIALUNAS',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    193,
    'TRADICIONAL',
    'kg tradicional o limón',
    0.00,
    1300.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    194,
    '1/2 TRADICIONAL',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    195,
    'PROMO 1/4 pya',
    '',
    0.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    196,
    'TOPPIG',
    '',
    500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    197,
    'exp o américa',
    '',
    1300.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    198,
    '2 exp o ameri',
    '',
    2300.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    199,
    'latte o capucc',
    '',
    1800.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    200,
    '2 latte o capucc',
    '',
    3200.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    201,
    'expre + mediaL',
    '',
    1700.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    202,
    'latte + media L',
    '',
    2100.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    203,
    'SUBMARINO',
    '',
    1800.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    204,
    'PIZZAS GRANDE MUZZA',
    '',
    8800.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    205,
    '1 PANCHO',
    '',
    2000.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    206,
    '2 PANCHOS',
    '',
    3500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    207,
    'pancho + gaseosa',
    '',
    3500.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    208,
    '1 EMPANADA',
    '',
    1100.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    209,
    '3 EMPANADAS',
    '',
    3250.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    210,
    'X6 EMPANADAS',
    '',
    6100.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    211,
    'X12 EMPANADAS',
    '',
    11800.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
),
(
    212,
    'gaseosa 500ML',
    '',
    1800.00,
    0.00,
    0,
    0,
    '2024-12-01 18:04:50'
);

/*!40000 ALTER TABLE `productos` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `productos_en_ventas`
--

LOCK TABLES `PRODUCTOS_EN_VENTAS` WRITE;

/*!40000 ALTER TABLE `productos_en_ventas` DISABLE KEYS */;

INSERT INTO `PRODUCTOS_EN_VENTAS` VALUES (
    12,
    12,
    212,
    2,
    1800.00,
    3600.00
),
(
    13,
    13,
    211,
    1,
    11800.00,
    11800.00
);

/*!40000 ALTER TABLE `productos_en_ventas` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `retiros`
--

LOCK TABLES `RETIROS` WRITE;

/*!40000 ALTER TABLE `retiros` DISABLE KEYS */;

INSERT INTO `RETIROS` VALUES (
    8,
    19,
    '2024-12-02 22:39:46',
    'Fabri',
    5000.00
),
(
    9,
    20,
    '2024-12-02 22:43:27',
    'Balance por error de caja',
    16800.00
);

/*!40000 ALTER TABLE `retiros` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `TURNOS` WRITE;

/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;

INSERT INTO `TURNOS` VALUES (
    19,
    'Facu',
    10000.00,
    16800.00,
    'abierto',
    '2024-12-02 22:38:55',
    '2024-12-02 22:41:35',
    '2024-12-02 22:38:55',
    '2024-12-02 22:41:35',
    NULL,
    0
),
(
    20,
    'Lu',
    16800.00,
    NULL,
    'abierto',
    '2024-12-02 22:42:05',
    NULL,
    '2024-12-02 22:42:05',
    '2024-12-02 22:42:05',
    NULL,
    1
);

/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `USUARIOS` WRITE;

/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;

/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `VENTAS` WRITE;

/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;

INSERT INTO `VENTAS` VALUES (
    12,
    5,
    2,
    19,
    '2024-12-02 22:39:13',
    3600.00,
    0
),
(
    13,
    5,
    1,
    19,
    '2024-12-02 22:39:35',
    11800.00,
    0
);

/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;

UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-02 19:52:43
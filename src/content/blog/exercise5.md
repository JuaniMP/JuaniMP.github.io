---
title: 'Ejercicio 5: Base de Datos de Librería'
description: 'Creación de una base de datos completa desde cero - Learn SQL in a Month of Lunches'
pubDate: 'Feb 8 2026'
icon: 'web'
tags: ['Oracle', 'DDL', 'DML']
---

## Enunciado
Crear una base de datos completa para un sistema de gestión de librería, incluyendo tablas de títulos, autores, clientes, pedidos y promociones, basado en el primer capítulo del libro **"Learn SQL in a Month of Lunches"**.

## Contexto
Este ejercicio introduce los conceptos fundamentales de Oracle mediante la creación de un sistema de base de datos relacional completo. El diseño implementa:

- **Tablas maestras**: Almacenan entidades principales (libros, autores, clientes)
- **Tablas de relación**: Conectan entidades con relaciones muchos-a-muchos (TitleAuthor)
- **Tablas transaccionales**: Registran operaciones del negocio (pedidos, items de pedido)
- **Tablas de referencia**: Contienen datos de soporte (promociones)

### Adaptación de SQL Server a Oracle

El código original del libro está escrito para SQL Server. Las principales conversiones realizadas para Oracle fueron:

1. **Tipos de datos numéricos**:
   - `INT` → `NUMBER(10)` - Enteros de hasta 10 dígitos
   - `DECIMAL(5,2)` → `NUMBER(5,2)` - Números decimales con precisión definida

2. **Tipos de datos de texto**:
   - `VARCHAR(n)` → `VARCHAR2(n)` - Oracle requiere VARCHAR2 como estándar

3. **Tipos de datos de fecha**:
   - `DATE` se mantiene, pero requiere conversión explícita
   - `'2015-04-30'` → `TO_DATE('2015-04-30', 'YYYY-MM-DD')`

4. **Inserción de datos múltiples**:
   - Oracle no soporta múltiples `VALUES` en un solo `INSERT`
   - Se utiliza `INSERT ALL ... INTO ... SELECT * FROM dual;`
   - `dual` es una tabla especial de Oracle para operaciones sin tabla origen

5. **Transacciones**:
   - En Oracle es necesario ejecutar `COMMIT` explícitamente para confirmar cambios

## Solución Oracle

### Creación de Tablas (DDL)

```sql
-- Tabla de Títulos/Libros
CREATE TABLE Title (
    TitleID NUMBER(10) NOT NULL,
    TitleName VARCHAR2(50) NOT NULL,
    Price NUMBER(5,2) NOT NULL,
    Advance NUMBER(8,2) NOT NULL,
    Royalty NUMBER(5,2) NULL,
    PublicationDate DATE NOT NULL
);

-- Tabla de Autores
CREATE TABLE Author (
    AuthorID NUMBER(10) NOT NULL,
    FirstName VARCHAR2(30) NOT NULL,
    MiddleName VARCHAR2(30) NULL,
    LastName VARCHAR2(30) NOT NULL,
    PaymentMethod VARCHAR2(50) NOT NULL
);

-- Tabla intermedia Autor-Título (relación muchos a muchos)
CREATE TABLE TitleAuthor (
    TitleID NUMBER(10) NOT NULL,
    AuthorID NUMBER(10) NOT NULL,
    AuthorOrder NUMBER(10) NOT NULL
);

-- Tabla de Clientes
CREATE TABLE Customer (
    CustomerID NUMBER(10) NOT NULL,
    FirstName VARCHAR2(30) NOT NULL,
    LastName VARCHAR2(30) NOT NULL,
    Address VARCHAR2(50) NULL,
    City VARCHAR2(50) NULL,
    State VARCHAR2(5) NULL,
    Zip VARCHAR2(10) NULL,
    Country VARCHAR2(50) NULL
);

-- Tabla de Encabezado de Pedidos
CREATE TABLE OrderHeader (
    OrderID NUMBER(10) NOT NULL,
    CustomerID NUMBER(10) NOT NULL,
    PromotionID NUMBER(10) NULL,
    OrderDate DATE NOT NULL
);

-- Tabla de Items de Pedido (detalle)
CREATE TABLE OrderItem (
    OrderID NUMBER(10) NOT NULL,
    OrderItem NUMBER(10) NOT NULL,
    TitleID NUMBER(10) NOT NULL,
    Quantity NUMBER(10) NOT NULL,
    ItemPrice NUMBER(5,2) NOT NULL
);

-- Tabla de Promociones
CREATE TABLE Promotion (
    PromotionID NUMBER(10) NOT NULL,
    PromotionCode VARCHAR2(10) NOT NULL,
    PromotionStartDate DATE NOT NULL,
    PromotionEndDate DATE NOT NULL
);

-- Tabla de ejemplo para primer query
CREATE TABLE MyFirstQuery (
    Outcome VARCHAR2(20) NOT NULL
);
```

### Inserción de Datos (DML)

```sql
/* INSERCIÓN DE DATOS */

-- Tabla Title
INSERT ALL
    INTO Title (TitleID, TitleName, Price, Advance, Royalty, PublicationDate) VALUES (101, 'Pride and Predicates', 9.95, 5000, 15, TO_DATE('2015-04-30', 'YYYY-MM-DD'))
    INTO Title (TitleID, TitleName, Price, Advance, Royalty, PublicationDate) VALUES (102, 'The Join Luck Club', 9.95, 6000, 12, TO_DATE('2016-02-06', 'YYYY-MM-DD'))
    INTO Title (TitleID, TitleName, Price, Advance, Royalty, PublicationDate) VALUES (103, 'Catcher in the Try', 8.95, 5000, 10, TO_DATE('2017-04-03', 'YYYY-MM-DD'))
    INTO Title (TitleID, TitleName, Price, Advance, Royalty, PublicationDate) VALUES (104, 'Anne of Fact Tables', 12.95, 10000, 15, TO_DATE('2018-01-12', 'YYYY-MM-DD'))
    INTO Title (TitleID, TitleName, Price, Advance, Royalty, PublicationDate) VALUES (105, 'The DateTime Machine', 7.95, 5500, 15, TO_DATE('2019-02-04', 'YYYY-MM-DD'))
    INTO Title (TitleID, TitleName, Price, Advance, Royalty, PublicationDate) VALUES (106, 'The Great GroupBy', 10.95, 0, 20, TO_DATE('2019-12-23', 'YYYY-MM-DD'))
    INTO Title (TitleID, TitleName, Price, Advance, Royalty, PublicationDate) VALUES (107, 'The Call of the While', 8.95, 2500, 15, TO_DATE('2020-03-14', 'YYYY-MM-DD'))
    INTO Title (TitleID, TitleName, Price, Advance, Royalty, PublicationDate) VALUES (108, 'The Sum Also Rises', 7.95, 5000, 12, TO_DATE('2021-11-12', 'YYYY-MM-DD'))
SELECT * FROM dual;

-- Tabla Author
INSERT ALL
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (1, 'Paul', 'K', 'Tripp', 'Cash')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (2, 'Doug', NULL, 'Li', 'Check')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (3, 'Jen', NULL, 'Strong', 'Check')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (4, 'Jorge', 'Armando', 'Guerra', 'Check')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (5, 'Robert', 'Grant', 'Davidson', 'Check')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (6, 'Gail', 'Anne', 'Shawn', 'Check')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (7, 'Rebecca', NULL, 'Miller', 'Check')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (8, 'Andy', NULL, 'Melkin', 'Direct Deposit')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (9, 'Buck', NULL, 'Fernandez', 'Cash')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (10, 'Chris', NULL, 'Walenski', 'Direct Deposit')
    INTO Author (AuthorID, FirstName, MiddleName, LastName, PaymentMethod) VALUES (11, 'Deepthi', NULL, 'Mahadevan', 'Direct Deposit')
SELECT * FROM dual;

-- Tabla TitleAuthor
INSERT ALL
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (101, 2, 1)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (102, 3, 1)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (103, 4, 1)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (104, 5, 1)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (105, 6, 1)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (106, 7, 1)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (107, 11, 1)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (107, 1, 2)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (108, 8, 1)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (108, 9, 2)
    INTO TitleAuthor (TitleID, AuthorID, AuthorOrder) VALUES (108, 10, 3)
SELECT * FROM dual;

-- Tabla Customer
INSERT ALL
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (1, 'Chris', 'Dixon', '212 N Rose St', 'Lakewood', 'CO', '80215', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (2, 'David', 'Power', '44 Wiley St', 'Henderson', 'NV', '89002', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (3, 'Arnold', 'Hinchcliffe', '7333 E Levine St', 'Atlanta', 'GA', '30303', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (4, 'Keanu', 'O''Ward', '415 N Hinson St', 'Madison', 'WI', '53703', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (5, 'Lisa', 'Rosenqvist', '56 S Burnett St', 'Reston', 'VA', '20190', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (6, 'Maggie', 'Ilott', '111 Fuson St', 'Flagstaff', 'AZ', '86015', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (7, 'Cora', 'Daly', '55 S Brandt St', 'Anaheim', 'CA', '92802', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (8, 'Dan', 'Wilson', '29 W Pousson St', 'Seattle', 'WA', '98104', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (9, 'Kelly', 'Wheldon', '300 Dewsnup St', 'Boise', 'ID', '83703', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (10, 'Bhaskar', 'Palou', '3443 E Ramella St', 'Evansville', 'IN', '47702', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (11, 'Kevin', 'Daly', '123 Terry St', 'Rochester', 'NY', '02345', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (12, 'Jordan', 'Ericsson', '187 E Boich St', 'Gilbert', 'AZ', '85296', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (13, 'Ming', 'Zhou', '42 S Walsh St', 'Portsmouth', 'NH', '03801', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (14, 'Jack', 'Sato', '242 S Corbett St', 'Burlington', 'VT', '05401', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (15, 'Joe', 'Pagenaud', '59 E Fleming St', 'Detroit', 'MI', '48202', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (16, 'Tara', 'Di Silvestro', '789 N Kizer St', 'San Diego', 'CA', '92101', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (17, 'Sandra', 'Calderon', '5 W Delany St', 'Denver', 'CO', '80014', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (18, 'Margaret', 'Montoya', '48 Clark St', 'Monterey', 'CA', '93940', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (19, 'Monica', 'Newgarden', '99 Lynn St', 'Clayton', 'MO', '63105', 'USA')
    INTO Customer (CustomerID, FirstName, LastName, Address, City, State, Zip, Country) VALUES (20, 'Mia', 'Rossi', '276 N Morrison St', 'Orlando', 'FL', '32801', 'USA')
SELECT * FROM dual;

-- Tabla OrderHeader
INSERT ALL
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1001, 1, NULL, TO_DATE('2015-06-01', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1002, 2, NULL, TO_DATE('2015-06-15', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1003, 3, NULL, TO_DATE('2015-07-03', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1004, 4, NULL, TO_DATE('2015-08-12', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1005, 5, NULL, TO_DATE('2015-09-05', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1006, 6, 1, TO_DATE('2015-11-02', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1007, 7, 1, TO_DATE('2015-11-15', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1008, 8, 1, TO_DATE('2015-11-22', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1009, 9, NULL, TO_DATE('2016-02-12', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1010, 3, NULL, TO_DATE('2016-03-01', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1011, 10, NULL, TO_DATE('2016-06-30', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1012, 1, NULL, TO_DATE('2016-09-02', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1013, 6, 2, TO_DATE('2016-11-03', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1014, 11, 2, TO_DATE('2016-11-12', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1015, 5, 2, TO_DATE('2016-11-14', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1016, 7, 2, TO_DATE('2016-11-23', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1017, 12, NULL, TO_DATE('2016-12-08', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1018, 13, NULL, TO_DATE('2017-01-31', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1019, 3, NULL, TO_DATE('2017-04-05', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1020, 8, NULL, TO_DATE('2017-07-22', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1021, 14, NULL, TO_DATE('2017-10-16', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1022, 13, 3, TO_DATE('2017-11-01', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1023, 2, 3, TO_DATE('2017-11-14', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1024, 14, 3, TO_DATE('2017-11-20', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1025, 4, NULL, TO_DATE('2018-01-23', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1026, 5, NULL, TO_DATE('2018-05-25', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1027, 12, 4, TO_DATE('2018-06-14', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1028, 11, 5, TO_DATE('2018-11-01', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1029, 10, 5, TO_DATE('2018-11-11', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1030, 4, NULL, TO_DATE('2019-02-24', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1031, 15, 6, TO_DATE('2019-06-07', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1032, 16, NULL, TO_DATE('2019-08-11', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1033, 9, 7, TO_DATE('2019-11-04', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1034, 10, 7, TO_DATE('2019-11-14', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1035, 4, NULL, TO_DATE('2019-12-29', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1036, 3, NULL, TO_DATE('2020-01-18', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1037, 4, NULL, TO_DATE('2020-03-15', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1038, 17, NULL, TO_DATE('2020-05-22', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1039, 10, NULL, TO_DATE('2020-09-13', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1040, 7, 9, TO_DATE('2020-11-07', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1041, 8, 9, TO_DATE('2020-11-21', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1042, 6, NULL, TO_DATE('2021-01-29', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1043, 18, NULL, TO_DATE('2021-04-23', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1044, 19, NULL, TO_DATE('2021-06-06', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1045, 11, NULL, TO_DATE('2021-10-01', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1046, 4, NULL, TO_DATE('2021-11-13', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1047, 19, NULL, TO_DATE('2021-11-28', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1048, 16, NULL, TO_DATE('2021-01-15', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1049, 20, 12, TO_DATE('2021-03-05', 'YYYY-MM-DD'))
    INTO OrderHeader (OrderID, CustomerID, PromotionID, OrderDate) VALUES (1050, 1, 12, TO_DATE('2022-03-10', 'YYYY-MM-DD'))
SELECT * FROM dual;

-- Tabla OrderItem
INSERT ALL
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1001, 1, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1002, 1, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1003, 1, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1004, 1, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1005, 1, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1006, 1, 101, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1007, 1, 101, 2, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1008, 1, 101, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1009, 1, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1010, 1, 102, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1011, 1, 102, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1011, 2, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1012, 1, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1012, 2, 102, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1013, 1, 101, 3, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1014, 1, 101, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1014, 2, 102, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1015, 1, 102, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1016, 1, 101, 2, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1017, 1, 102, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1018, 1, 102, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1019, 1, 103, 1, 8.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1020, 1, 103, 1, 8.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1021, 1, 101, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1021, 2, 102, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1021, 3, 103, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1022, 1, 101, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1022, 1, 103, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1023, 1, 102, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1024, 1, 101, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1025, 1, 104, 1, 12.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1026, 1, 103, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1027, 1, 101, 1, 8.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1028, 1, 102, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1028, 2, 103, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1029, 1, 103, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1030, 1, 105, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1031, 1, 105, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1032, 1, 105, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1033, 1, 102, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1033, 2, 103, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1034, 1, 102, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1034, 2, 103, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1034, 3, 104, 1, 10.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1034, 4, 105, 1, 5.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1035, 1, 106, 1, 10.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1036, 1, 105, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1037, 1, 107, 1, 8.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1038, 1, 101, 1, 9.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1039, 1, 105, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1040, 1, 105, 1, 5.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1041, 1, 105, 1, 5.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1041, 2, 107, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1042, 1, 105, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1043, 1, 105, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1044, 1, 105, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1044, 2, 103, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1045, 1, 105, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1046, 1, 108, 1, 5.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1047, 1, 108, 1, 5.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1047, 2, 101, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1048, 1, 105, 1, 7.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1049, 1, 101, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1049, 2, 102, 1, 6.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1049, 3, 103, 1, 5.95)
    INTO OrderItem (OrderID, OrderItem, TitleID, Quantity, ItemPrice) VALUES (1050, 1, 108, 1, 4.95)
SELECT * FROM dual;

-- Tabla Promotion
INSERT ALL
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (1, '2OFF2015', TO_DATE('2011-11-01', 'YYYY-MM-DD'), TO_DATE('2011-11-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (2, '2OFF2016', TO_DATE('2012-11-01', 'YYYY-MM-DD'), TO_DATE('2012-11-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (3, '2OFF2017', TO_DATE('2013-11-01', 'YYYY-MM-DD'), TO_DATE('2013-11-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (4, '1OFF2018', TO_DATE('2014-06-01', 'YYYY-MM-DD'), TO_DATE('2014-06-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (5, '2OFF2018', TO_DATE('2014-11-01', 'YYYY-MM-DD'), TO_DATE('2014-11-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (6, '1OFF2019', TO_DATE('2015-06-01', 'YYYY-MM-DD'), TO_DATE('2015-06-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (7, '2OFF2019', TO_DATE('2015-11-01', 'YYYY-MM-DD'), TO_DATE('2015-11-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (8, '1OFF2020', TO_DATE('2016-06-01', 'YYYY-MM-DD'), TO_DATE('2016-06-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (9, '2OFF2020', TO_DATE('2016-11-01', 'YYYY-MM-DD'), TO_DATE('2016-11-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (10, '1OFF2021', TO_DATE('2017-06-01', 'YYYY-MM-DD'), TO_DATE('2017-06-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (11, '2OFF2021', TO_DATE('2017-11-01', 'YYYY-MM-DD'), TO_DATE('2017-11-30', 'YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate) VALUES (12, '3OFF2022', TO_DATE('2018-03-04', 'YYYY-MM-DD'), TO_DATE('2018-03-11', 'YYYY-MM-DD'))
SELECT * FROM dual;

-- Tabla MyFirstQuery
INSERT INTO MyFirstQuery (Outcome) VALUES ('Hello, World!');

-- Confirmar cambios en la base de datos
COMMIT;
```

### Consulta de Verificación

```sql
-- Tu primera consulta en el libro
SELECT Outcome FROM MyFirstQuery;
```

## Modelo de Datos

El sistema implementa las siguientes relaciones:

- **Title** ↔ **TitleAuthor** ↔ **Author**: Relación muchos-a-muchos entre libros y autores
- **Customer** → **OrderHeader**: Un cliente puede tener múltiples pedidos
- **OrderHeader** ↔ **Promotion**: Un pedido puede tener una promoción opcional
- **OrderHeader** → **OrderItem**: Un pedido contiene múltiples items
- **OrderItem** → **Title**: Cada item hace referencia a un libro específico


/*
* Author: Alex P
* Project Name: bamazon
* Version: 1
* Date: 10.09.17
* URL:  https://github.com/ItsOkayItsOfficial/bamazon
*/

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);


SELECT * FROM bamazon.products;

INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('1', 'Porsche 917K', 'Cars', 14000000.00, 12);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('2' , 'Land Rover Defender 127', 'Trucks', 30000.00, 43);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('3', 'IMZ Ural Patrol', 'Motorcycles', 17000.00, 69);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('4', 'Honda CB750 Daryl Dixon Nighthawk', 'Motorcycles', 25000.00, 48);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('5', 'Ferrari F40', 'Cars', 840000.00, 62);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('6', 'Mercedes-Benz W196', 'Cars', 31000000.00, 2);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('7', 'Ferrari 250 GTO', 'Cars', 38000000.00, 6);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('8', 'Aston Martin DB5', 'Cars', 80000.00, 24);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('9', 'Porsche 959', 'Cars', 110000.00, 53);
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('10', 'CJ-5 Willy\'s Jeep', 'Trucks', 16000.00, 65);


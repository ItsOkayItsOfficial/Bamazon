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
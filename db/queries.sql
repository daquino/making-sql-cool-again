-- Insert
insert into product(category,name,price)
 values ('ELECTRONIC','Macbook Pro',2499.99);
insert into product_reviews(product_id,username,rating,description)
 values (2,'daquino',4,'Loved it')

 -- Multi value insert
insert into product(category,name,price)
  values ('ELECTRONICS','Macbook Pro',2499.99),
		 ('BOOKS','The Name of the Wind',14.99);
insert into product_reviews(product_id,username,rating,description)
  values (2,'daquino',4,'Loved it'),
		 (2,'waquino',2,'Too long'),
		 (1,'daquino',2,'Hate the new keyboard');

-- Update individual product
update product 
 set price=999.99, name='iPhone 10 XS'
 where id = 100;

-- Delete individual product
delete from product_review
  where product_id=100;
delete from product 
  where id=100;

-- select with filter and paging
select name,price
 from product
 where category = 'ELECTRONICS'
 and price >= 500.00 and price < 1000.00
 offset 0
 fetch first 20 rows only;

-- Aggregate function
select avg(rating)
 from product_review
 where product_id = 123;

-- Aggregate with group by
select product_id,avg(rating)
  from product_review r
  where product_id in (100,123,499)
  group by product_id;

-- Join
SELECT p.name,p.price,avg(r.rating)
  FROM product p
  JOIN product_review r ON (p.id=r.product_id)
  WHERE p.category = 'ELECTRONICS' AND p.price >= 500 AND price < 1000
  GROUP BY p.id
  OFFSET 0
  FETCH first 20 ROWS only;


-- Making the join slow again with order
select p.name,p.price,avg(r.rating)
  from product p
  join product_review r on (p.id=r.product_id)
  where p.category = 'ELECTRONICS' and p.price >= 500 and price < 1000
  group by p.id
  order by p.price
  offset 0
  fetch first 20 rows only;
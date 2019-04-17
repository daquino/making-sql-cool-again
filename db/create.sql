create schema dev;

CREATE TABLE dev.product(
    id bigserial PRIMARY key,
    category varchar(20) default 'NONE',
    name varchar(100),
    price DECIMAL
);

CREATE TABLE dev.product_review(
    id bigserial PRIMARY key,
    product_id bigint,
    username text,
    rating int,
    description text,
    foreign key (product_id) references dev.product(id)
);

create schema prod;

CREATE TABLE prod.product(
    id bigserial PRIMARY key,
    category varchar(20),
    name varchar(100),
    price DECIMAL
);

CREATE TABLE prod.product_review(
    id bigserial PRIMARY key,
    product_id bigint,
    username text,
    rating int,
    description text,
    foreign key (product_id) references prod.product(id)
);

CREATE TABLE product(
    id bigserial PRIMARY key,
    category varchar(20),
    name varchar(100),
    price DECIMAL
);

CREATE TABLE product_review(
    id bigserial PRIMARY key,
    product_id bigint,
    username text,
    rating int,
    description text,
    foreign key (product_id) references product(id)
);

create index product_review_product_idx on product_review(product_id);
create index product_category_price_idx on product(category, price);
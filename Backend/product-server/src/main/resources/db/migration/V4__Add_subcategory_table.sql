-- 1. Clean all data from related tables
TRUNCATE TABLE product RESTART IDENTITY CASCADE;
TRUNCATE TABLE category RESTART IDENTITY CASCADE;

-- 2. Create the 'subcategory' table
CREATE TABLE subcategory (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_id INTEGER NOT NULL,
        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE
);

-- 3. Create a sequence for 'subcategory'
CREATE SEQUENCE IF NOT EXISTS subcategory_seq increment by 50;

-- 4. Update the 'product' table to include a 'subcategory_id' column
ALTER TABLE product
    ADD COLUMN subcategory_id INTEGER NOT NULL,
ADD CONSTRAINT fk_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategory (id) ON DELETE CASCADE;

-- Insert categories with a sequence for ID
INSERT INTO category (id, description, name) VALUES
                                                 (nextval('category_seq'), 'Devices and gadgets like phones and laptops', 'Electronics'),
                                                 (nextval('category_seq'), 'Household furniture and fixtures', 'Furniture'),
                                                 (nextval('category_seq'), 'Sports equipment and outdoor gear', 'Sports & Outdoors');

-- Insert subcategories with a sequence for ID
INSERT INTO subcategory (id, name, category_id) VALUES
                                                    (nextval('subcategory_seq'), 'Smartphones', (SELECT id FROM category WHERE name = 'Electronics')),
                                                    (nextval('subcategory_seq'), 'Laptops', (SELECT id FROM category WHERE name = 'Electronics')),
                                                    (nextval('subcategory_seq'), 'Sofas', (SELECT id FROM category WHERE name = 'Furniture')),
                                                    (nextval('subcategory_seq'), 'Tables', (SELECT id FROM category WHERE name = 'Furniture')),
                                                    (nextval('subcategory_seq'), 'Bikes', (SELECT id FROM category WHERE name = 'Sports & Outdoors')),
                                                    (nextval('subcategory_seq'), 'Camping Gear', (SELECT id FROM category WHERE name = 'Sports & Outdoors'));

-- Insert products for the 'Smartphones' subcategory
INSERT INTO product (id, available_quantity, description, name, price, category_id, subcategory_id) VALUES
                                                                                                        (nextval('product_seq'), 50, 'Latest Apple smartphone', 'iPhone 14', 999.99,
                                                                                                         (SELECT id FROM category WHERE name = 'Electronics'),
                                                                                                         (SELECT id FROM subcategory WHERE name = 'Smartphones')),
                                                                                                        (nextval('product_seq'), 30, 'Android smartphone with excellent camera', 'Galaxy S23', 799.99,
                                                                                                         (SELECT id FROM category WHERE name = 'Electronics'),
                                                                                                         (SELECT id FROM subcategory WHERE name = 'Smartphones'));

-- Insert products for the 'Laptops' subcategory
INSERT INTO product (id, available_quantity, description, name, price, category_id, subcategory_id) VALUES
                                                                                                        (nextval('product_seq'), 20, 'Powerful laptop for professionals', 'MacBook Pro', 1999.99,
                                                                                                         (SELECT id FROM category WHERE name = 'Electronics'),
                                                                                                         (SELECT id FROM subcategory WHERE name = 'Laptops')),
                                                                                                        (nextval('product_seq'), 40, 'Budget-friendly laptop for students', 'Acer Aspire 5', 549.99,
                                                                                                         (SELECT id FROM category WHERE name = 'Electronics'),
                                                                                                         (SELECT id FROM subcategory WHERE name = 'Laptops'));

-- Insert products for the 'Sofas' subcategory
INSERT INTO product (id, available_quantity, description, name, price, category_id, subcategory_id) VALUES
                                                                                                        (nextval('product_seq'), 10, 'Comfortable and stylish sofa', 'Leather Sofa', 899.99,
                                                                                                         (SELECT id FROM category WHERE name = 'Furniture'),
                                                                                                         (SELECT id FROM subcategory WHERE name = 'Sofas')),
                                                                                                        (nextval('product_seq'), 15, 'Modern sofa with adjustable recline', 'Recliner Sofa', 1299.99,
                                                                                                         (SELECT id FROM category WHERE name = 'Furniture'),
                                                                                                         (SELECT id FROM subcategory WHERE name = 'Sofas'));

-- Insert products for the 'Bikes' subcategory
INSERT INTO product (id, available_quantity, description, name, price, category_id, subcategory_id) VALUES
                                                                                                        (nextval('product_seq'), 20, 'Durable bike for tough terrains', 'Mountain Bike', 349.99,
                                                                                                         (SELECT id FROM category WHERE name = 'Sports & Outdoors'),
                                                                                                         (SELECT id FROM subcategory WHERE name = 'Bikes')),
                                                                                                        (nextval('product_seq'), 25, 'Lightweight road bike', 'Road Bike', 499.99,
                                                                                                         (SELECT id FROM category WHERE name = 'Sports & Outdoors'),
                                                                                                         (SELECT id FROM subcategory WHERE name = 'Bikes'));

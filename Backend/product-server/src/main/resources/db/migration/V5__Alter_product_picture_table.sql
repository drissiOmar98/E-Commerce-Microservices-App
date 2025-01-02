ALTER TABLE product_picture
DROP COLUMN file;


ALTER TABLE product_picture
    ADD COLUMN file oid;
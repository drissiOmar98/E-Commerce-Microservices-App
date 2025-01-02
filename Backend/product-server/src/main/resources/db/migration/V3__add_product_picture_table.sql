-- Create the ProductPicture table
CREATE TABLE IF NOT EXISTS product_picture (
    id BIGSERIAL PRIMARY KEY,
    product_fk INTEGER NOT NULL,
    file BYTEA NOT NULL,
    file_content_type VARCHAR(255),
    is_cover BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_fk) REFERENCES product (id) ON DELETE CASCADE
    );

-- Add auditing columns to the product table
ALTER TABLE product
    ADD COLUMN IF NOT EXISTS created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE product
    ADD COLUMN IF NOT EXISTS last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE SEQUENCE IF NOT EXISTS product_picture_seq increment by 50;
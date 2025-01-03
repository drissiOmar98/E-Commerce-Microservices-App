package com.omar.cart_service.exception;

public class CartNotFoundException  extends RuntimeException{
    public CartNotFoundException(String message){
        super(message);
    }
}

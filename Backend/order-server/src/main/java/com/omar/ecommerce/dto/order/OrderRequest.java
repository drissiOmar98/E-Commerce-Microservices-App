package com.omar.ecommerce.dto.order;


import com.omar.ecommerce.entities.PaymentMethod;
import jakarta.validation.constraints.NotNull;


public record OrderRequest(
        Integer id,
//        String reference,
        @NotNull(message = "Payment method should be precised")
        PaymentMethod paymentMethod

//        @NotEmpty(message = "You should at least purchase one product")
//        List<PurchaseRequest> products
) {
}

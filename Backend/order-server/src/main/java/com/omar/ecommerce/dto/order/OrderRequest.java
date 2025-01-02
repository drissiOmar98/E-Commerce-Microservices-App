package com.omar.ecommerce.dto.order;

import com.omar.ecommerce.client.product.PurchaseRequest;
import com.omar.ecommerce.entities.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequest(
        Integer id,
        String reference,

        @NotNull(message = "Payment method should be precised")
        PaymentMethod paymentMethod,

        @NotEmpty(message = "You should at least purchase one product")
        List<PurchaseRequest> products
) {
}

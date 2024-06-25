package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.dto.payment.PaymentMapper;
import com.omar.ecommerce.dto.payment.PaymentRequest;
import com.omar.ecommerce.notification.NotificationProducer;
import com.omar.ecommerce.notification.PaymentNotificationRequest;
import com.omar.ecommerce.repositories.PaymentRepository;
import com.omar.ecommerce.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    private final PaymentMapper paymentMapper;

    private final NotificationProducer notificationProducer;


    @Override
    public Integer createPayment(PaymentRequest request) {
        var payment = this.paymentRepository.save(this.paymentMapper.toPayment(request));

        this.notificationProducer.sendNotification(
                new PaymentNotificationRequest(
                        request.orderReference(),
                        request.amount(),
                        request.paymentMethod(),
                        request.customer().firstname(),
                        request.customer().lastname(),
                        request.customer().email()
                )
        );

        return payment.getId();
    }
}

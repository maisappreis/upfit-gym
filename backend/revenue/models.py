from django.db import models
from customer.models import Customer


class Revenue(models.Model):
    PAYMENT_CHOICES = [
        ('À pagar', 'À pagar'),
        ('Link enviado', 'Link enviado'),
        ('Pago', 'Pago'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    year = models.IntegerField(null=False, blank=False)
    month = models.CharField(max_length=50, null=False, blank=False)
    payment_day = models.IntegerField(null=False, blank=False)
    value = models.FloatField(null=False, blank=False)
    paid = models.CharField(max_length=50, choices=PAYMENT_CHOICES, default='À pagar')
    notes = models.TextField(null=True, blank=True)


    def __str__(self):
        return self.customer

    class Meta:
        unique_together = ['customer', 'year', 'month']

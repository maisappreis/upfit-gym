from django.db import models


class Expense(models.Model):
    PAYMENT_CHOICES = [
        ('À pagar', 'À pagar'),
        ('Pago', 'Pago'),
    ]

    name = models.CharField(max_length=255, null=False, blank=False)
    year = models.IntegerField(null=False, blank=False)
    month = models.CharField(max_length=50, null=False, blank=False)
    due_date = models.DateField(null=False, blank=False)
    value = models.FloatField(null=False, blank=False)
    paid = models.CharField(max_length=50, choices=PAYMENT_CHOICES, default='À pagar')
    notes = models.TextField(null=True, blank=True)
    

    def __str__(self):
        return self.name

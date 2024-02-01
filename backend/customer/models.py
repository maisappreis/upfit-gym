from django.db import models


class Customer(models.Model):
    STATUS_CHOICES = [
        ('Ativo', 'Ativo'),
        ('Inativo', 'Inativo'),
    ]

    name = models.CharField(max_length=255, null=False, blank=False)
    frequency = models.CharField(max_length=2, null=False, blank=False)
    start = models.DateField(null=False, blank=False)
    plan = models.CharField(max_length=255, null=False, blank=False)
    value = models.FloatField(null=False, blank=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Ativo')
    notes = models.TextField(null=True, blank=True)


    def __str__(self):
        return self.name
    
    class Meta:
        unique_together = ['name']

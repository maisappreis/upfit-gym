"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from customer.views import CustomerListView, CustomerCreateView, CustomerUpdateDestroyView
from revenue.views import RevenueListView, RevenueCreateView, RevenueUpdateDestroyView
from expense.views import ExpenseListView, ExpenseCreateView, ExpenseUpdateDestroyView


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/customer/', CustomerListView.as_view(), name='customer-list'),
    path('api/customer/create/', CustomerCreateView.as_view(), name='customer-create'),
    path('api/customer/<int:pk>/', CustomerUpdateDestroyView.as_view(), name='customer-edit'),

    path('api/revenue/', RevenueListView.as_view(), name='revenue-list'),
    path('api/revenue/create/', RevenueCreateView.as_view(), name='revenue-create'),
    path('api/revenue/<int:pk>/', RevenueUpdateDestroyView.as_view(), name='revenue-edit'),

    path('api/expense/', ExpenseListView.as_view(), name='expense-list'),
    path('api/expense/create/', ExpenseCreateView.as_view(), name='expense-create'),
    path('api/expense/<int:pk>/', ExpenseUpdateDestroyView.as_view(), name='expense-edit'),
]
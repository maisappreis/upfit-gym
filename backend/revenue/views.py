from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Revenue
from .serializers import RevenueSerializer


class RevenueListView(APIView):

    def get(self, request, *args, **kwargs):
        revenues = Revenue.objects.all()
        serializer = RevenueSerializer(revenues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

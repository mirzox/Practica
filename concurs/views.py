from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


from .models import Contest, Command, Participants
from .serializers import ContestSerializer, CommandSerializer, ParticipantsSerializer


class ContestView(viewsets.ViewSet):

    def list(self, request):
        query = Contest.objects.filter()
        serializer = ContestSerializer(query, many=True)
        return Response(serializer.data)


class CommandView(viewsets.ViewSet):

    @transaction.atomic()
    def create(self, request):
        print(request.data)
        serializer = CommandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ParticipantsView(viewsets.ViewSet):

    @transaction.atomic()
    def create(self, request):
        serializer = ParticipantsSerializer(data=request.data)
        c_id = request.data.get('command_id')
        if Participants.objects.filter(command_id__c_id=c_id).count() + 1 > get_object_or_404(Command, c_id=c_id).m_count:
            return Response({"error": "Вы не можете добавить больше участников"}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

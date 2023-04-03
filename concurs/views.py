from django.db import transaction
from django.shortcuts import render, redirect
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


from .models import Contest, Command, Participants
from .serializers import ContestSerializer, CommandSerializer, ParticipantsSerializer
from .forms import CommandForm, ParticipantsForm


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




def main(request):
    if request.method == "GET":
        return render(request, 'main.html')


def index(request):
    if request.method == "GET":
        query = Contest.objects.get(id=1)
        if query.a:
            form = CommandForm()
            return render(request, 'index.html', {'form': form})
        else:
            return redirect('main')

    elif request.method == "POST":

        # data = request.POST['contest_id'] = Contest.objects.get(a=True).id
        form = CommandForm(request.POST)
        # form['contest_id'] = Contest.objects.get(a=True).id

        if form.is_valid():
            # print(form.data)
            a = form.save()
            # Command.objects.get()
            return redirect(f"/reg/{a.c_id}/")
            # return render(request, 'index.html', {'form': form})
        print(form.errors)
        return render(request, 'index.html', {'form': form, "errors": form.errors})


def reg(request, pk):
    if request.method == "GET":
        form = ParticipantsForm()
        return render(request, 'pastisipants.html',  {'form': form})

    elif request.method == "POST":
        form = ParticipantsForm(request.POST, request.FILES)

        if form.is_valid():
            # print(form.data)
            a = form.save(command_id=pk)
            return render(request, 'pastisipants.html',  {'form': form})
        print(form.errors)
        return render(request, 'pastisipants.html', {'form': form, "errors": form.errors})

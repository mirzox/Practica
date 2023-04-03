# import form class from django
from django import forms

# import GeeksModel from models.py
from .models import Command, Contest, Participants


class CommandForm(forms.ModelForm):
    class Meta:
        model = Command
        fields = "__all__"
        exclude = ('contest_id',)

    def save(self, commit=True):
        instance = super(CommandForm, self).save(commit=False)
        instance.contest_id = Contest.objects.get(a=True)
        if commit:
            instance.save()
        return instance


class ParticipantsForm(forms.ModelForm):
    class Meta:
        model = Participants
        fields = "__all__"
        exclude = ('command_id', )

    def save(self, commit=True, command_id=None):
        instance = super(ParticipantsForm, self).save(commit=False)
        instance.command_id = Command.objects.get(c_id=command_id)
        if commit:
            instance.save()
        return instance

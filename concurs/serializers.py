from rest_framework import serializers

from .models import Contest, Command, Participants


class ContestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contest
        fields = "__all__"


class CommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Command
        fields = "__all__"

    def validate_name(self, value: str):
        return value.title()

    def validate_consult(self, value: str):
        return value.title()

    def validate_passport(self, value: str):
        return value.upper()

    def validate_phone(self, value: str):
        if not value.startswith('998'):
            raise serializers.ValidationError('phone number must start with 998')
        elif len(value) != 12:
            raise serializers.ValidationError('phone must contains 12 digits')
        return value


class ParticipantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participants
        fields = "__all__"

    def validate_phone(self, value: str):
        if not value.startswith('998'):
            raise serializers.ValidationError('phone number must start with 998')
        elif len(value) != 12:
            raise serializers.ValidationError('phone must contains 12 digits')
        return value

    def validate_firstname(self, value: str):
        # validation body
        return value.title()

    def validate_lastname(self, value: str):
        # validation body
        return value.title()

    def validate_secondname(self, value: str):
        # validation body
        return value.title()

    def validate_passport(self, value: str):
        return value.upper()

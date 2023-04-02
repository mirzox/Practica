from django.contrib import admin
from import_export.admin import ExportActionMixin, ImportExportModelAdmin, ExportActionModelAdmin
from import_export import fields, resources

from .models import Contest, Command, Participants


class ParticipantResource(ExportActionModelAdmin):

    class Meta:
        model = Participants
        fields = ['p_id', 'command_id__name',  'is_captain', 'firstname', 'secondname', 'lastname', 'uni_name', 'degree', 'course', 'img_preview_p']


class AdminContest(ExportActionMixin, admin.ModelAdmin):
    list_display = ['id', 'h', 'b', 'a', 'img_preview']
    list_filter = ['a', 'h']
    # list_editable = ['h', 'b', 'a']
    readonly_fields = ['img_preview']
    search_fields = ['__all__']


class AdminCommand(ExportActionMixin, admin.ModelAdmin):
    list_display = ['c_id', 'contest_id', 'mail', 'name', 'motto', 'm_count']
    search_fields = ['__all__']


class AdminParticipants(ExportActionMixin, admin.ModelAdmin):
    list_display = ['p_id', 'get_name',  'is_captain', 'firstname', 'secondname', 'lastname', 'uni_name', 'degree', 'course', 'img_preview_p']
    list_filter = ['is_captain', 'uni_name', 'degree', 'course']
    readonly_fields = ['img_preview_p']
    search_fields = ['__all__']
    # resource_classes = [ParticipantResource]

    @admin.display(ordering='command_id__c_id', description='Название команды')
    def get_name(self, obj):
        return obj.command_id.name


admin.site.register(Contest, AdminContest)
admin.site.register(Command, AdminCommand)
admin.site.register(Participants, AdminParticipants)

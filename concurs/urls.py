from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ContestView, CommandView, ParticipantsView

router = DefaultRouter()
router.register('contest', ContestView, basename='contest')
router.register("command", CommandView, basename="command")
router.register("participant", ParticipantsView, basename="participant")

urlpatterns = [
    path('', include(router.urls)),

]

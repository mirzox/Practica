from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator
from django.utils.html import mark_safe
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_delete, post_save


def file_dir_path(instance, filename):
    extension = filename.split('.')[-1]
    # print(instance.p_id)
    new_filename = f"photos/{instance.p_id}-{instance.command_id}.{extension}"
    return new_filename


def com_dir_path(instance, filename):
    extension = filename.split('.')[-1]
    print(instance.id)
    new_filename = f"contest/{instance.id}.{extension}"
    return new_filename


class Contest(models.Model):
    id = models.AutoField(primary_key=True, unique=True, auto_created=True)
    h = models.TextField(verbose_name="Заголовок")
    b = models.TextField(verbose_name="Основной контент")
    a = models.BooleanField(default=True, verbose_name="Активно")
    f = models.ImageField(upload_to=com_dir_path, null=True, blank=True, verbose_name="Фото")

    def img_preview(self):  # new
        return mark_safe(f'<img src = "{self.f.url}" width = "100"/>')

    class Meta:
        verbose_name = 'Конкурс'
        verbose_name_plural = 'Конкурсы'


class Command(models.Model):
    c_id = models.AutoField(primary_key=True, unique=True, auto_created=True)
    contest_id = models.ForeignKey(to=Contest, on_delete=models.CASCADE, verbose_name="ID конкурса")
    mail = models.EmailField(verbose_name="Почта", unique=True)
    name = models.CharField(max_length=100, verbose_name="Название")
    motto = models.CharField(max_length=150, verbose_name="Девиз")
    m_count = models.PositiveIntegerField(validators=[MinValueValidator(2, message="Значение должно быть больше 2"),
                                                      MaxValueValidator(5, message="Значение должно быть меньше 5")],
                                          verbose_name="Количество участников")
    consult = models.CharField(max_length=250, verbose_name="Консультант")
    passport = models.CharField(max_length=25, verbose_name="Паспортные данные", unique=True)
    c_mail = models.EmailField(verbose_name="Почта", unique=True)
    phone = models.CharField(max_length=25, verbose_name="Номер", unique=True)

    class Meta:
        verbose_name = 'Команду'
        verbose_name_plural = 'Команды'

    def __str__(self):
        return self.name


class Participants(models.Model):
    class GenderChoices(models.TextChoices):
        MALE = "MALE"
        FEMALE = "FEMALE"

    p_id = models.AutoField(primary_key=True, unique=True, auto_created=True)
    command_id = models.ForeignKey(to=Command, on_delete=models.CASCADE, verbose_name="ID команды")
    is_captain = models.BooleanField(default=False, verbose_name="Капитан ли")
    firstname = models.CharField(max_length=150, verbose_name="Имя")
    lastname = models.CharField(max_length=150, verbose_name="Фамилия")
    secondname = models.CharField(max_length=150, verbose_name="Отчество")
    passport = models.CharField(max_length=25, verbose_name="Паспортные данные", unique=True)
    photo = models.ImageField(upload_to=file_dir_path, verbose_name="Фото")
    gender = models.CharField(choices=GenderChoices.choices, max_length=50, verbose_name="Пол")
    uni_name = models.CharField(max_length=150, verbose_name="ВУЗ")
    faculty = models.CharField(max_length=150, verbose_name="Факультет")
    degree = models.CharField(max_length=150, verbose_name="Образование")
    course = models.IntegerField(verbose_name="Курс")
    mail = models.EmailField(verbose_name="Почта", unique=True)
    phone = models.CharField(max_length=12, validators=[MinLengthValidator(12)], verbose_name="Номер", unique=True)
    interests = models.TextField(verbose_name="Интересы")

    def img_preview_p(self):  # new
        return mark_safe(f'<img src = "{self.photo.url}" width = "100"/>')

    class Meta:
        verbose_name = 'Участник'
        verbose_name_plural = 'Участники'


@receiver(pre_save, sender=Contest)
def update_days(sender, instance, created=False, **kwargs):
    if Contest.objects.filter(a=True).count() > 1:
        Contest.objects.filter(a=True).update(a=False)


# @receiver(post_save, sender=Participants)
# def update_days(sender, instance, created=False, **kwargs):
#     # print(created)
#     if created:
#         if Participants.objects.filter(command_id__c_id=instance.command_id.c_id).count() >= get_object_or_404(Command, c_id=instance.command_id.c_id).m_count:
#             raise Exception("Participants count is more than normal")

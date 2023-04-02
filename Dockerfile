FROM python:3.10

ARG BUILD_VERSION

LABEL name="practica" \
      version=$BUILD_VERSION

RUN mkdir -p /data/django/app
RUN mkdir /data/django/staticfiles
RUN mkdir /data/django/media
RUN mkdir /data/django/media/photos
RUN mkdir /data/django/media/contest

RUN mkdir /data/django/backup
WORKDIR /data/django/app
COPY requirements.txt /data/django/app
RUN python3 -m venv venv
RUN . venv/bin/activate && python3 -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /data/django/app

RUN chmod +x docker-entrypoint.sh
EXPOSE 8000
CMD ["/bin/bash", "docker-entrypoint.sh"]

#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
#CMD ["gunicorn", "--bind", ":8000", "command1.command1.wsgi:application"]

# For some other command
# CMD ["python", "app.py"]

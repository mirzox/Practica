#! /bin/bash
gunicorn --bind :8000 Practica.wsgi:application --workers 4

# Generated by Django 5.0.4 on 2024-04-15 03:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_teacher_identification_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='first_login',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='teacher',
            name='first_login',
            field=models.BooleanField(default=True),
        ),
    ]
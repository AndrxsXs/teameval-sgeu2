# Generated by Django 5.0.4 on 2024-05-11 23:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_teacher_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='admi',
            name='phone',
            field=models.BigIntegerField(null=True),
        ),
    ]

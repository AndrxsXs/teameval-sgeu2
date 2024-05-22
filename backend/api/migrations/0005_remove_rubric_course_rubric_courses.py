# Generated by Django 5.0.4 on 2024-05-21 21:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_standard_scale_description_delete_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rubric',
            name='course',
        ),
        migrations.AddField(
            model_name='rubric',
            name='courses',
            field=models.ManyToManyField(related_name='rubrics', to='api.course'),
        ),
    ]

# Generated by Django 5.0.4 on 2024-04-20 23:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_user_first_login'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='rol',
            new_name='role',
        ),
    ]

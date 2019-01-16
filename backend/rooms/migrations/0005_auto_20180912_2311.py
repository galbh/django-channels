# Generated by Django 2.1.1 on 2018-09-12 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0004_room_messages'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='messages',
        ),
        migrations.AddField(
            model_name='room',
            name='messages',
            field=models.ManyToManyField(null=True, to='rooms.Message'),
        ),
    ]

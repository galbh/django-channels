# Generated by Django 2.1.1 on 2018-09-16 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0011_room_event'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='messages',
            field=models.ManyToManyField(blank=True, null=True, to='rooms.Message'),
        ),
    ]
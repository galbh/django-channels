# Generated by Django 2.1.1 on 2018-09-18 19:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('date_matcher', '0013_auto_20180918_1903'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='max_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 9, 25, 22, 22, 18, 352962), null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='min_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 9, 18, 22, 22, 18, 352962), null=True),
        ),
    ]

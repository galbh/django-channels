# Generated by Django 2.1.1 on 2018-09-17 00:06

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('date_matcher', '0008_auto_20180917_0106'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='max_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 9, 24, 3, 6, 49, 711001), null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='min_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 9, 17, 3, 6, 49, 711001), null=True),
        ),
    ]

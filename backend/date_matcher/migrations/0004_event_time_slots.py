# Generated by Django 2.1.1 on 2018-09-15 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('date_matcher', '0003_auto_20180915_1238'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='time_slots',
            field=models.ManyToManyField(blank=True, to='date_matcher.TimeSlot'),
        ),
    ]

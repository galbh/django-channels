# Generated by Django 2.1.1 on 2018-09-15 16:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('date_matcher', '0004_event_time_slots'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='time_slots',
        ),
        migrations.AddField(
            model_name='timeslot',
            name='event',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='date_matcher.Event'),
        ),
    ]

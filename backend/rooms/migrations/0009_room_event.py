# Generated by Django 2.1.1 on 2018-09-15 15:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('date_matcher', '0003_auto_20180915_1238'),
        ('rooms', '0008_auto_20180914_1224'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='event',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='date_matcher.Event'),
        ),
    ]
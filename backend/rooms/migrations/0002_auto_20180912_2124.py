# Generated by Django 2.1.1 on 2018-09-12 18:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20180803_1631'),
        ('rooms', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='admins',
            field=models.ManyToManyField(blank=True, null=True, related_name='admins', to='accounts.UserProfile'),
        ),
        migrations.AddField(
            model_name='room',
            name='members',
            field=models.ManyToManyField(blank=True, related_name='members', to='accounts.UserProfile'),
        ),
    ]

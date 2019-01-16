# Generated by Django 2.1.1 on 2018-09-12 20:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20180803_1631'),
        ('rooms', '0002_auto_20180912_2124'),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('creator', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.UserProfile')),
            ],
        ),
    ]

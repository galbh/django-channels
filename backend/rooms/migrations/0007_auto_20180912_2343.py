# Generated by Django 2.1.1 on 2018-09-12 20:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0006_auto_20180912_2342'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='creator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='creator', to='accounts.UserProfile'),
        ),
    ]

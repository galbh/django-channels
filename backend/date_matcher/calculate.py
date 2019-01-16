from backend.accounts.models import UserProfile
from backend.accounts.serializers import UserProfileSerializer
from backend.date_matcher.serializers import TimeSlotSerializer
from backend.rooms.models import Room

dictionary = {}
matches = []


def calculate_date(time_slots, event):
    room = Room.objects.get(id=event['room_id'])
    report = {'submissions': {}, 'matches': [], 'missing_voters': []}

    matches.clear()

    for idx, time_slot in enumerate(time_slots):
        if time_slot.start_time not in dictionary:
            dictionary[time_slot.start_time] = [time_slot]
        else:
            if time_slot not in dictionary[time_slot.start_time]:
                dictionary[time_slot.start_time].append(time_slot)

    for key in list(dictionary.keys()):
        time_stamp = key
        votes = dictionary.get(key)
        unique_users = set([obj.user for obj in votes])

        if len(unique_users) == len(room.members.all()):
            if time_stamp.isoformat() not in matches:
                matches.append(time_stamp.isoformat())

        report['submissions'][time_stamp.isoformat()] = {
            'votes': TimeSlotSerializer(votes, many=True).data,
            'voters': UserProfileSerializer(unique_users, many=True).data
        }

    unique_time_slots = set([obj.user for obj in time_slots])
    total_unique_users = []
    for ts in unique_time_slots:
        total_unique_users.append(UserProfile.objects.get(user=ts.user))

    missing_voters = filter(lambda x: x not in total_unique_users, room.members.all())

    report['matches'] = matches

    report['missing_voters'] = UserProfileSerializer(missing_voters, many=True).data

    dictionary.clear()

    return report

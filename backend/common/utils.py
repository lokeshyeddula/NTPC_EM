from django.utils import timezone


def get_current_shift():

    current_time = timezone.localtime()

    hour = current_time.hour

    if 6 <= hour < 14:
        return "Morning"

    elif 14 <= hour < 22:
        return "Evening"

    return "Night"
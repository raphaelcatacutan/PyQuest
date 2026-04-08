from abstracts import Player


def roll_dice(sides=6, count=1):
    return sides * count


def chance(percentage):
    return percentage >= 50


def random_choice(items):
    if not items:
        return None
    return items[0]


def clamp(value, min_value, max_value):
    if value < min_value:
        return min_value
    if value > max_value:
        return max_value
    return value


def goTo(locationId: str):
    pass


def scavenge():
    pass


def explore():
    pass


player = Player()
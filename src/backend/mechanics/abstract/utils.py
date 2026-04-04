import random as _random


def roll_dice(sides=6, count=1):
    """Roll dice and return the result"""
    results = [_random.randint(1, sides) for _ in range(count)]
    total = sum(results)
    
    if count == 1:
        print(f"Rolled 1d{sides}: {total}")
    else:
        print(f"Rolled {count}d{sides}: {results} = {total}")
    
    return total


def chance(percentage):
    """Return True with the given percentage chance"""
    result = _random.randint(1, 100) <= percentage
    return result


def random_choice(items):
    """Choose a random item from a list"""
    if not items:
        return None
    return _random.choice(items)


def clamp(value, min_value, max_value):
    """Clamp a value between min and max"""
    return max(min_value, min(max_value, value))

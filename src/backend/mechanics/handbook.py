"""PyQuest Handbook

A beginner-friendly handbook for core Python concepts used in PyQuest.
"""

"""Welcome to PyQuest.

This handbook teaches Python in 6 phases:
Forest -> Swamp -> Jungle -> Temple -> Desert -> Cemetery

Each phase unlocks new game content and Python features. Follow the examples and tips to master the mechanics and become a PyQuest Master!

Each section has a 
- "Damage" rating that indicates how much it damages enemies in the game. 
- Brief explanations of the concept, its importance in PyQuest, and example code snippets.

"""


"""
PHASE 1: FOREST
Goal: Learn Python basics and your first movement/combat actions.

1) Print statement [Damage: 1]
What this means:
- print() shows information in the terminal.
- Use it to display text, variable values, and quick checks.

Why this matters in PyQuest:
- If something is not working, print lets you see what your code is doing.
- It is your first and fastest debugging tool.

Example:
print('Hello, PyQuest!')
hp = 100
print('Current HP:', hp)

Tip:
- Print values before and after important actions.
- Common mistake: printing too little, then guessing what went wrong.


2) Variables [Damage: 2]
What this means:
- A variable is a named container for data.
- You can update its value while the game is running.

Why this matters in PyQuest:
- Player HP, coins, energy, and level are all tracked with variables.
- Good names make bugs easier to find.

Example:
name = 'Ari'
coins = 10
coins = coins + 5
print(name, coins)

Tip:
- Use descriptive names like player_hp or enemy_level.
- Common mistake: vague names like x, a1, or temp2.


3) Data types [Damage: 2]
What this means:
- Python values have types, such as str, int, float, and bool.
- Type controls what operations are allowed.

Why this matters in PyQuest:
- Many beginner bugs come from mixing types by accident.
- The right type prevents conversion and comparison errors.

Example:
hero = 'Ari'      # str
level = 1         # int
accuracy = 0.82   # float
is_alive = True   # bool
print(type(hero), type(level), type(accuracy), type(is_alive))

Tip:
- If behavior looks strange, inspect with type(value).
- Common mistake: treating '10' (text) as 10 (number).


4) Arithmetic and math [Damage: 2]
What this means:
- Python supports arithmetic operators: +, -, *, /, //, %, **.

Why this matters in PyQuest:
- Damage, rewards, cooldowns, and scaling all depend on math.
- Clear formulas give predictable game behavior.

Example:
damage = 12
bonus = 3
total = damage + bonus
half = total / 2
remainder = total % 5
power = total ** 2
print(total, half, remainder, power)

Tip:
- Use parentheses when formulas get longer.
- Common mistake: expecting / to return an integer.


Unlocked actions:
- goTo('Forest') or other available scenes
- punch()

Example:
goTo('Forest')
punch()
"""


"""
PHASE 2: SWAMP
Goal: Control the flow of your code with decisions and loops.

1) Conditional statements (if / elif / else) [Damage: 1]
What this means:
- Conditions choose which code block runs.

Why this matters in PyQuest:
- Your game logic can react to HP, energy, enemy status, or location.

Example:
hp = 40
if hp < 30:
    print('Critical HP')
elif hp < 60:
    print('Need caution')
else:
    print('Stable')

Tip:
- Order conditions from narrow/specific to broad/general.
- Common mistake: overlapping conditions that hide later checks.


2) Match-case statements [Damage: 1]
What this means:
- match/case chooses behavior based on one exact value.

Why this matters in PyQuest:
- It keeps scene or command handling cleaner than many if/elif lines.

Example:
scene = 'Swamp'
match scene:
    case 'Forest':
        print('Fast scouting')
    case 'Swamp':
        print('Slow movement')
    case _:
        print('Unknown terrain')

Tip:
- Always include case _ as a fallback.


3) Conditional expressions (ternary) [Damage: 1]
What this means:
- A short one-line if/else expression.

Why this matters in PyQuest:
- Useful when the decision is simple and you want compact code.

Example:
hp = 55
status = 'danger' if hp < 60 else 'safe'
print(status)

Tip:
- If it becomes hard to read, switch back to a normal if/else block.


4) Relational operators [Damage: 1]
What this means:
- ==, !=, <, <=, >, >= compare two values.

Why this matters in PyQuest:
- Every rule check (unlock, damage gate, level requirement) uses comparisons.

Example:
level = 3
print(level >= 2)
print(level == 5)

Tip:
- Use == for checking equality.
- Use = only for assignment.


5) Looping statements [Damage: 1]
What this means:
- Loops repeat code until a stop condition is reached.

Why this matters in PyQuest:
- Repeated actions like countdowns, turns, and scans use loops.

Example:
count = 3
while count > 0:
    print('Countdown:', count)
    count -= 1

Tip:
- Make sure something inside the loop changes toward the stop condition.


6) while [Damage: 1]
What this means:
- while keeps running while its condition stays True.

Why this matters in PyQuest:
- Great when you do not know in advance how many repeats you need.

Example:
energy = 3
while energy > 0:
    print('Attack')
    energy -= 1

Tip:
- During debugging, print the variable that controls the loop.


7) continue [Damage: 1]
What this means:
- continue skips the rest of the current loop round.

Why this matters in PyQuest:
- Lets you ignore unwanted values cleanly.

Example:
for n in [1, 2, 3, 4]:
    if n == 3:
        continue
    print(n)

Tip:
- Use continue to reduce deep nesting.


8) break [Damage: 1]
What this means:
- break stops the loop immediately.

Why this matters in PyQuest:
- Useful when you already found what you were looking for.

Example:
for n in [1, 2, 3, 4]:
    if n == 3:
        break
    print(n)

Tip:
- Place break carefully so you do not exit too early.


9) Logical operators [Damage: 1]
What this means:
- and, or, not combine or invert conditions.

Why this matters in PyQuest:
- Real game rules usually depend on more than one condition.

Example:
hp = 80
energy = 20
can_fight = hp > 50 and energy > 10
print(can_fight)

Tip:
- Add parentheses to make complex logic easier to read.
"""


"""
PHASE 3: JUNGLE
Goal: Write reusable code with functions.

1) Functions [Damage: 1]
What this means:
- A function is a named block of reusable code.

Why this matters in PyQuest:
- You avoid repeating logic and keep behavior consistent.

Example:
def greet():
    print('Welcome, explorer')

greet()

Tip:
- If you copy the same code twice, consider turning it into a function.


2) Defining functions [Damage: 1]
What this means:
- Define with def name(parameters): followed by indented code.

Why this matters in PyQuest:
- Clean function inputs and outputs make systems easier to extend.

Example:
def hit(base, bonus):
    return base + bonus

print(hit(10, 2))

Tip:
- Use action names like compute_damage or apply_heal.


3) Default arguments [Damage: 1]
What this means:
- A default value is used if the caller does not pass one.

Why this matters in PyQuest:
- You can support common behavior while still allowing customization.

Example:
def heal(amount=10):
    print('Healed', amount)

heal()
heal(25)

Tip:
- Avoid mutable defaults like [] or {}.


4) Function call [Damage: 3]
What this means:
- Run a function by writing function_name(arguments).

Why this matters in PyQuest:
- A good function is only useful if called correctly.

Example:
def square(x):
    return x * x

value = square(5)
print(value)

Tip:
- Match argument count and order with the function definition.


5) return [Damage: 1]
What this means:
- return sends a value back and stops the function.

Why this matters in PyQuest:
- Returned values can be used by other game logic.

Example:
def is_low(hp):
    return hp < 40

print(is_low(25))

Tip:
- Return useful data instead of printing everything inside the function.


6) Unlocked Store [Damage: 3]
What this means:
- You can now call utility and store-related game methods.

Why this matters in PyQuest:
- Your Python code starts interacting with real game systems.

Example:
print('Store unlocked. Check available module methods in-game.')

Tip:
- Check required parameter types before calling methods.


7) Built-in functions [Damage: 3]
What this means:
- Python includes handy built-ins like len, type, max, min, sum, and range.

Why this matters in PyQuest:
- Built-ins are usually clearer and safer than reinventing the same logic.

Example:
values = [2, 4, 6]
print(len(values))
print(sum(values))
print(max(values))

Tip:
- Prefer built-ins when they directly match your intent.
"""


"""
PHASE 4: TEMPLE
Goal: Use object-oriented programming (OOP).

1) Object-Oriented Programming [Damage: 1]
What this means:
- OOP groups data and behavior into classes and objects.

Why this matters in PyQuest:
- Players, enemies, and items are easier to model as objects.

Example:
class Player:
    def __init__(self, name):
        self.name = name

p = Player('Ari')
print(p.name)

Tip:
- Use classes when data and behavior naturally belong together.


2) Abstraction [Damage: 1]
What this means:
- Expose simple methods, hide internal complexity.

Why this matters in PyQuest:
- Other code can use your class without knowing every internal detail.

Example:
class Door:
    def open(self):
        print('Door opens')

Tip:
- Public methods should express intent, not internal steps.


3) Inheritance [Damage: 1]
What this means:
- A child class can reuse features from a parent class.

Why this matters in PyQuest:
- Shared behavior across entities avoids duplicated code.

Example:
class Entity:
    def move(self):
        print('Entity moves')

class Player(Entity):
    pass

Player().move()

Tip:
- Use inheritance only for true is-a relationships.


4) Polymorphism [Damage: 1]
What this means:
- Different classes can share a method name with different behavior.

Why this matters in PyQuest:
- One loop can call unit.attack() for many unit types.

Example:
class Warrior:
    def attack(self):
        print('Slash')

class Mage:
    def attack(self):
        print('Fireball')

for unit in [Warrior(), Mage()]:
    unit.attack()

Tip:
- Prefer shared behavior over many type checks.


5) Encapsulation [Damage: 1]
What this means:
- Keep internal state controlled through methods.

Why this matters in PyQuest:
- You reduce invalid state changes and protect important data.

Example:
class Chest:
    def __init__(self):
        self._gold = 0

    def add_gold(self, amount):
        self._gold += amount

Tip:
- Add validation in methods that change important values.


6) super() [Damage: 3]
What this means:
- super() calls a parent class method from the child class.

Why this matters in PyQuest:
- You can keep base setup and extend behavior safely.

Example:
class Base:
    def __init__(self):
        self.kind = 'base'

class Child(Base):
    def __init__(self):
        super().__init__()
        self.kind = 'child'

print(Child().kind)

Tip:
- In overridden methods, call super() when parent setup is still needed.


7) Static methods [Damage: 1]
What this means:
- A static method belongs to a class but does not use instance data.

Why this matters in PyQuest:
- Great for utility helpers related to a class domain.

Example:
class MathTool:
    @staticmethod
    def double(x):
        return x * 2

print(MathTool.double(7))

Tip:
- Use static methods only when no instance state is required.


Unlocked:
- Weapons and Armors systems.
"""


"""
PHASE 5: DESERT
Goal: Master Python data structures.

1) Python data structures [Damage: 1]
What this means:
- The main containers are list, dict, tuple, and set.

Why this matters in PyQuest:
- Picking the right container improves speed, clarity, and bug resistance.

Tip:
- Choose by need: order, uniqueness, mutability, and fast lookup.


2) Lists [Damage: 2]
What this means:
- A list is ordered and mutable (you can change it).

Why this matters in PyQuest:
- Perfect for inventory-like collections that change often.

Example:
items = ['potion', 'sword', 'shield']
items.append('key')
print(items)

Tip:
- Use list when item order matters.


3) Dictionary [Damage: 2]
What this means:
- A dictionary stores key-value pairs.

Why this matters in PyQuest:
- Ideal for named properties like hp, mana, and defense.

Example:
player = {'hp': 100, 'energy': 40}
player['hp'] -= 10
print(player)

Tip:
- Use dict.get(key, default) when a key may be missing.


4) Tuples [Damage: 2]
What this means:
- A tuple is ordered but immutable.

Why this matters in PyQuest:
- Useful for fixed records like map coordinates.

Example:
spawn = (10, 20)
print(spawn[0], spawn[1])

Tip:
- Use tuple when values should not be changed.


5) Sets [Damage: 2]
What this means:
- A set stores unique values with no guaranteed order.

Why this matters in PyQuest:
- Great for quick membership checks and duplicate removal.

Example:
visited = {'Forest', 'Swamp'}
visited.add('Forest')
print(visited)

Tip:
- Use set for uniqueness and frequent in/not in checks.


6) *args [Damage: 1]
What this means:
- *args gathers extra positional arguments into a tuple.

Why this matters in PyQuest:
- Lets you write functions that accept flexible item counts.

Example:
def total(*nums):
    return sum(nums)

print(total(1, 2, 3, 4))

Tip:
- Useful for aggregator-style functions.


7) **kwargs [Damage: 1]
What this means:
- **kwargs gathers extra named arguments into a dictionary.

Why this matters in PyQuest:
- Good for optional settings and configuration-style calls.

Example:
def show_stats(**stats):
    print(stats)

show_stats(hp=90, energy=30)

Tip:
- Validate required keys before using them.


8) for loop [Damage: 1]
What this means:
- for iterates through each item in a collection.

Why this matters in PyQuest:
- Most list/dict/set processing uses for loops.

Example:
for item in ['potion', 'herb', 'gem']:
    print(item)

Tip:
- Prefer for over while when iterating known collections.


9) Accessing [Damage: 1]
What this means:
- Use indexes for list/tuple/string and keys for dict.

Why this matters in PyQuest:
- Correct access avoids IndexError and KeyError crashes.

Example:
arr = [10, 20, 30]
print(arr[1])

bag = {'coins': 12}
print(bag['coins'])

Tip:
- Check index bounds and key existence for uncertain inputs.


10) Membership operators [Damage: 1]
What this means:
- in and not in check whether a value exists in a container.

Why this matters in PyQuest:
- Useful for validation, filtering, and unlock checks.

Example:
print(2 in [1, 2, 3])
print('Forest' in {'Forest', 'Desert'})

Tip:
- Sets are typically fastest for repeated membership checks.
"""


"""
PHASE 6: CEMETERY
Goal: Write safer and more expressive Python code.

1) Exception handling [Damage: 1]
What this means:
- try/except handles expected runtime failures without crashing everything.

Why this matters in PyQuest:
- Bad input should show a helpful message, not kill the game flow.

Example:
try:
    value = int('42')
    print(value)
except ValueError:
    print('Conversion failed')

Tip:
- Catch specific exception types.
- Common mistake: using broad except and hiding real bugs.


2) Format specifiers [Damage: 1]
What this means:
- Format specifiers control how values appear in output.

Why this matters in PyQuest:
- Clean output helps both debugging and player-facing clarity.

Example:
hp = 87
acc = 0.9234
print(f'HP: {hp:03d}')
print(f'Accuracy: {acc:.2%}')

Tip:
- Use one formatting style consistently across your project.


3) Type casting [Damage: 3]
What this means:
- Casting converts one type into another, like str to int.

Why this matters in PyQuest:
- Many inputs arrive as text and must be converted before math.

Example:
num = int('12')
ratio = float('3.5')
text = str(99)
print(num, ratio, text)

Tip:
- Validate before conversion to avoid ValueError.


4) String indexing [Damage: 1]
What this means:
- You can access characters by position using indexes.

Why this matters in PyQuest:
- Helpful for parsing simple commands and format checks.

Example:
name = 'PyQuest'
print(name[0])
print(name[-1])

Tip:
- Check that the string is not empty before indexing.


5) String methods [Damage: 3]
What this means:
- Methods like lower, upper, strip, replace, and split transform text.

Why this matters in PyQuest:
- They help clean user input and normalize commands.

Example:
raw = '  Welcome to PyQuest  '
clean = raw.strip().replace('PyQuest', 'the dungeon')
parts = clean.split()
print(clean)
print(parts)

Tip:
- String methods return new strings; they do not modify the original.
"""

